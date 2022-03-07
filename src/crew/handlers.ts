import { EventTuple, fx, regEventFx } from "../store";
import { crewEvent } from "./events";
import * as R from "ramda";
import { makeRequestPayload } from "../api";
import { routeEvent, routeIds } from "../routes/events";
import { CrewForm, regFormSubmitHandler } from "../forms/handlers";
import { failure, success } from "../api/util";
import { explodeDate, transformFields } from "../util";
import {
  onEdit,
  setSubmittingFx,
  setProcessingFx,
  validateForm,
} from "../forms/helpers";
import { getForms } from "../forms/selectors";
import { getRouteId } from "../routes/selectors";
import { derive } from "framework-x";
import {
  CrewCertificateFromJSON,
  CrewCertificateFromJSONTyped,
  CrewCertificateToJSON,
  CrewDetailsFromJSONTyped,
} from "../../gen/ts";
import { saveAs } from "../util";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../util";

const CREW_ADD_DEFAULTS = {
  fullname: "",
  role: "",
  active_crew: true,
  coastal: false,
  locallimits: false,
  offshore: false,
  restrictedlimits: false,
  medicalcertno: "",
  medicalcertissued: undefined,
  medicalcertexpiry: undefined,
  firstaidno: "",
  firstaidissued: undefined,
  firstaidexpiry: undefined,
  notes: "",
};

const validations: Array<{ name: string; rule: string }> = [
  { name: "firstname", rule: "required" },
  { name: "lastname", rule: "required" },
  { name: "role", rule: "required" },
  { name: "medicalcertissued", rule: "date" },
  { name: "medicalcertexpiry", rule: "date" },
  { name: "firstaidexpiry", rule: "date" },
  { name: "firstaidissued", rule: "date" },
];
const certValidations: Array<{ name: string; rule: string }> = [
  { name: "qualification", rule: "required" },
  { name: "issue_date", rule: "date" },
  { name: "expiry_date", rule: "date" },
];

regEventFx(routeIds.CREW_LIST, (_) => {
  return [
    fx.api(["crew", "get", "many"], { perPage: 1000 }),
    fx.api(["crewoverdue", "get", "one"], {}),
  ];
});

regEventFx(routeIds.CREW_DETAIL, ({ db }, { id }) => [
  fx.api(["crew", "get", "many"], { id }),
  fx.api(["crewcert", "get", "many"], { perPage: 1000, crewId: id }),
  fx.api(["crew-document", "get", "many"], { crewId: id, perPage: 1000 }),
]);

regEventFx(routeIds.CREW_ADD, (_) => {
  return [fx.db(R.assocPath(["forms", "crew"], CREW_ADD_DEFAULTS))];
});

regEventFx(routeIds.CREW_EDIT, onEdit("crew", routeIds.CREW_DETAIL));

regEventFx(routeIds.CREW_CERTS, ({ db }, { id }) => [
  fx.route(routeIds.CREW_DETAIL, { id }),
]);

regEventFx(routeIds.CREW_CERTS_ADD, ({ db }, { id }) => [
  // fx.api(["crew", "get", "one"], { id }),
  fx.db(R.assocPath(["forms", "crewcert"], { crew_id: id })),
]);
regEventFx(routeIds.CREW_CERTS_DETAIL, ({ db }, { id, childId }) => {
  if (!R.path(["data", "crewcert", childId], db)) {
    return [fx.route(routeIds.CREW_DETAIL, { id })];
  }
  let form = CrewCertificateToJSON(R.path(["data", "crewcert", childId], db));
  form["id"] = childId;
  return [
    fx.api(["crew", "get", "one"], { id }),
    fx.api(["crew-document", "get", "many"], { crewId: id, perPage: 1000 }),
    fx.db(R.assocPath(["forms", "crewcert"], form)),
  ];
});

regEventFx(routeIds.CREW_CERTS_EDIT, ({ db }, { id, childId }) => {
  if (!R.path(["data", "crewcert", childId], db)) {
    return [fx.route(routeIds.CREW_DETAIL, { id })];
  }
});

regFormSubmitHandler(
  ["crew", "create"],
  ({ db, form }: { db: any; form: CrewForm }) => {
    const validateResult = validateForm(form, validations);
    if (validateResult === true) {
      const payload = CrewDetailsFromJSONTyped(form, true);
      return [fx.api(["crew", "create", "one"], { payload })];
    } else {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
  }
);
regFormSubmitHandler(
  ["crew", "edit"],
  ({ db, form }: { db: any; form: CrewForm }) => {
    const validateResult = validateForm(form, validations);
    if (validateResult === true) {
      const payload = CrewDetailsFromJSONTyped(form, true);

      return [
        setSubmittingFx(true),
        fx.api(["crew", "update", "one"], { id: form.id, payload }),
      ];
    } else {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
  }
);

const submitCrewFileFx = (
  file: File,
  crewId: string,
  docType: string,
  objId?: string
) =>
  fx.api(
    ["crew-document", "create", "one"],
    {
      docType,
      objId: crewId,
      crewId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: `api/s3-presign-crew-${docType}-success`,
    }
  );

regEventFx("api/s3-presign-crew-first-aid-cert-success", ({ db }, rsp) => {
  const form = getForms(db).crew;
  const file = form?.firstAidCertFile;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.route(routeIds.CREW_DETAIL, { id: form.id }),
  ];
});

regEventFx("api/s3-presign-crew-medical-cert-success", ({ db }, rsp) => {
  const form = getForms(db).crew;
  const file = form?.medCertFile;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.route(routeIds.CREW_DETAIL, { id: form.id }),
  ];
});

/* I split them in case they separate. But they are identical right now */

regEventFx("api/create-one-crew-success", ({ db }, { id }) => {
  const form = getForms(db).crew;
  const firstAidCertFile = R.prop("firstAidCertFile", form);
  const medCertFile = R.prop("medCertFile", form);
  const ret = [
    ...(firstAidCertFile
      ? [submitCrewFileFx(firstAidCertFile, id, "first-aid-cert")]
      : [setSubmittingFx(false), fx.route(routeIds.CREW_DETAIL, { id })]),
    ...(medCertFile
      ? [submitCrewFileFx(medCertFile, id, "medical-cert")]
      : [setSubmittingFx(false), fx.route(routeIds.CREW_DETAIL, { id })]),
  ];
  return ret;
});

export const getPageType = derive([getRouteId], (routeId) => {
  const parts = routeId.split("/");
  return parts[0];
});

regEventFx("api/update-one-crew-success", ({ db, e }, { id }) => {
  const form = getForms(db).crew;
  const firstAidCertFile = R.prop("firstAidCertFile", form);
  const medCertFile = R.prop("medCertFile", form);

  let fileFx = [];
  if (firstAidCertFile) {
    if (firstAidCertFile === "deleted") {
      fileFx.push(
        fx.dispatch(crewEvent.DELETE_DOCUMENT, {
          id: form["firstAidCertFile_deleted"],
        })
      );
    } else {
      fileFx.push(submitCrewFileFx(firstAidCertFile, id, "first-aid-cert"));
    }
  }
  if (medCertFile) {
    if (medCertFile === "deleted") {
      fileFx.push(
        fx.dispatch(crewEvent.DELETE_DOCUMENT, {
          id: form["medCertFile_deleted"],
        })
      );
    } else {
      fileFx.push(submitCrewFileFx(medCertFile, id, "medical-cert"));
    }
  }
  if (
    firstAidCertFile === "deleted" ||
    !firstAidCertFile ||
    medCertFile === "deleted" ||
    !medCertFile
  ) {
    fileFx.push(setSubmittingFx(false));
    fileFx.push(fx.route(routeIds.CREW_DETAIL, { id }));
  }

  const curRoute = R.pathOr(
    "not-found",
    ["router", "match", "route", "id"],
    db
  );
  return curRoute == routeIds.VESSEL_DETAIL
    ? [setProcessingFx(id, false)]
    : fileFx;
});

regEventFx("api/update-one-crew-failure", (_, { id }) => [
  setSubmittingFx(false),
]);

regFormSubmitHandler(["crewcert", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, certValidations);
  if (validateResult === true) {
    const payload = CrewCertificateFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["crewcert", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["crewcert", "create"], (_, { form }) => {
  const validateResult = validateForm(form, certValidations);
  if (validateResult === true) {
    const payload = CrewCertificateFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["crewcert", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["crewcert", "delete"], (_, { form }) => {
  const payload = CrewCertificateFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["crewcert", "delete", "one"], { id: form.id }),
  ];
});

const submitCrewCertFileFx = (file: File, crewId: string, objId: string) =>
  fx.api(
    ["crew-document", "create", "one"],
    {
      crewId,
      docType: "crew_certificate",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: `api/s3-presign-crew-cert-success`,
    }
  );

regEventFx("api/s3-presign-crew-cert-success", ({ db }, rsp) => {
  const file = rsp.payload.file;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});
// TODO: auto-add these via the api handler?
regEventFx("api/update-one-crewcert-success", ({ db }, { crewId, id }) => {
  const form = getForms(db).crewcert;
  const file = form?.crew_file;

  let fileFx = [];
  if (file) {
    if (file === "deleted") {
      fileFx.push(
        fx.dispatch(crewEvent.DELETE_DOCUMENT, {
          id: form["crew_file_deleted"],
        })
      );
      fileFx.push(setSubmittingFx(false));
      fileFx.push(fx.dispatch(routeEvent.BACK));
    } else {
      fileFx.push(submitCrewCertFileFx(file, crewId, id));
    }
  } else {
    fileFx.push(setSubmittingFx(false));
    fileFx.push(fx.dispatch(routeEvent.BACK));
  }

  return fileFx;
});

regEventFx("api/create-one-crewcert-success", ({ db }, { crewId, id }) => {
  console.log("finished creating.", crewId, id);
  const form = getForms(db).crewcert;
  const file = form?.crew_file;

  return [
    ...(file
      ? [submitCrewCertFileFx(file, crewId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-crewcert-success", ({ db }, {}) => {
  const form = getForms(db)["crewcert"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "crewcert"])),
    fx.db(R.dissocPath(["data", "crewcert", form.id])),
    fx.route(routeIds.CREW_DETAIL, { id: form.crew_id }),
  ];
});

regEventFx("api/create-one-crewcert-failure", ({}, {}) => {
  return [setSubmittingFx(false)];
});
regEventFx("api/update-one-crewcert-failure", ({}, {}) => {
  return [setSubmittingFx(false)];
});

regEventFx(crewEvent.DOWNLOAD_DOCUMENT, ({ db }, { id }) => [
  fx.fetchApi({
    req: `/crewdocument/${id}`,
    success: "api/get-crew-document-success",
    failure: "api/get-crew-document-failure",
  }),
]);

regEventFx(crewEvent.DELETE_DOCUMENT, ({ db }, { id }) => {
  return [
    fx.api(
      ["crew-document", "delete", "one"],
      { id },
      { onSuccess: "api/delete-crew-document-success" }
    ),
  ];
});
regEventFx("api/delete-crew-document-success", ({ db }, _) => {
  const crewId = R.path(["router", "match", "params", "id"], db);
  return [
    fx.db(R.dissocPath(["data", "crew-document"])),
    fx.api(["crew-document", "get", "many"], { crewId: crewId, perPage: 1000 }),
  ];
});
regEventFx("api/get-crew-document-success", ({ db }, response) => {
  if (response.json && response.json.document_url) {
    const downloadUrl = response.json.document_url;
    const fileName = response.json.document_name;
    saveAs(downloadUrl, fileName);
  }
});
regEventFx("api/get-crew-document-success-fully", ({ db }, response) => {
  const docId = R.last(response.url.split("/"));
  const doc = R.find(R.propEq("id", docId))(
    R.values(R.pathOr({}, ["data", "crew-document"], db))
  );
  let fileName = !doc ? "ships-particulars.pdf" : doc.fileName;
  saveAs(response.blob, fileName);
});
