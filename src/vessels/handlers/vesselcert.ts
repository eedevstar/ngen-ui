import { dispatch, fx, regEventFx } from "../../store";
import { CertificateFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { routeEvent, routeIds } from "../../routes/events";
import * as R from "ramda";
import { getSelectedSubItemForm, getSelectedVesselId } from "../selectors";
import { getForms } from "forms/selectors";
import { vesselEvent } from "vessels/events";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../../util";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "cert_type", rule: "required" },
  { name: "issue_date", rule: "date" },
  { name: "expiry_date", rule: "date" },
];

regFormSubmitHandler(["vesselcert", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = CertificateFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["vesselcert", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["vesselcert", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = CertificateFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["vesselcert", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["vesselcert", "delete"], (_, { form }) => {
  const payload = CertificateFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["vesselcert", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "cert",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-vesselcert-success",
    }
  );
regEventFx("api/s3-presign-vesselcert-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.vessel_file;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});
// TODO: auto-add these via the api handler?
regEventFx("api/update-one-vesselcert-success", ({ db }, { vesselId, id }) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.vessel_file;
  let fileFx = [];
  if (file) {
    if (file === "deleted") {
      fileFx.push(
        fx.dispatch(vesselEvent.DELETE_DOCUMENT, {
          id: form["vessel_file_deleted"],
        })
      );
      fileFx.push(setSubmittingFx(false));
      fileFx.push(fx.dispatch(routeEvent.BACK));
    } else {
      fileFx.push(submitFileFx(file, vesselId, id));
    }
  } else {
    fileFx.push(setSubmittingFx(false));
    fileFx.push(fx.dispatch(routeEvent.BACK));
  }
  console.log(fileFx);
  const newTag = form?.new_tag ? form.cert_type : false;
  return [
    ...(newTag
      ? [
          fx.dispatch(vesselEvent.UPDATE_TAGS, {
            type: "certificate",
            tag: newTag,
          }),
        ]
      : []),
    ...fileFx,
  ];
});

regEventFx("api/create-one-vesselcert-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.vessel_file;
  const newTag = form?.new_tag ? form.cert_type : false;
  return [
    ...(newTag
      ? [
          fx.dispatch(vesselEvent.UPDATE_TAGS, {
            type: "certificate",
            tag: newTag,
          }),
        ]
      : []),
    ...(file === "deleted"
      ? fx.dispatch(vesselEvent.DELETE_DOCUMENT, {
          id: form["vessel_file_deleted"],
        })
      : file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-vesselcert-success", ({ db }, {}) => {
  const form = getForms(db)["vesselcert"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "vesselcert"])),
    fx.db(R.dissocPath(["data", "vesselcert", form.id])),
    fx.route(routeIds.VESSEL_CERTS, { id: form.vessel_id }),
  ];
});

regEventFx("api/create-one-vesselcert-failure", ({}, {}) => {
  return [setSubmittingFx(false)];
});
regEventFx("api/update-one-vesselcert-failure", ({}, {}) => {
  return [setSubmittingFx(false)];
});
