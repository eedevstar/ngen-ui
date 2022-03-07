import * as R from "ramda";
import { dispatch, EventTuple, fx, regEventFx } from "../../store";
import { vesselEvent } from "../events";
import { routeEvent, routeIds } from "../../routes/events";
import {
  onEdit,
  setSubmittingFx,
  setProcessingFx,
  validateForm,
} from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { saveAs, uploadToS3, isCustomerAdmin } from "../../util";
import { getForms, getSubCustomerId } from "forms/selectors";
import { VesselFromJSONTyped } from "../../../gen/ts/models";
import { formEvt } from "forms/events";
import { getCurrentUser } from "users/selectors";
import { getCustomer } from "customers/selectors";

export function exists(json: any, key: string) {
  const value = json[key];
  return value !== null && value !== undefined;
}

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
];

regEventFx(routeIds.VESSEL_LIST, ({ db }) => {
  let customerId = null;
  const user = getCurrentUser(db);
  if (!user) {
    return [];
  }
  if (isCustomerAdmin(user)) {
    customerId = getSubCustomerId();
  } else if (user) {
    customerId = user.customerId;
  }
  return [
    fx.api(["customer", "get", "many"], { perPage: 1000 }),
    fx.api(["vessel", "get", "many"], {
      perPage: 1000,
      customerId,
    }),
    fx.api(["overdue", "get", "one"], { perPage: 1000, customerId }),
  ];
});

regEventFx(routeIds.VESSEL_ADD, (_) => {
  return [fx.db(R.assocPath(["forms", "vessel"], {}))];
});

regEventFx(routeIds.VESSEL_DETAIL, ({ db }, { id }) => {
  let customerId = {};
  const user = getCurrentUser(db);
  if (!user) return [];

  if (isCustomerAdmin(user)) {
    customerId = getSubCustomerId();
  } else if (user) {
    customerId = user.customerId;
  }
  return [
    fx.dispatch(vesselEvent.SWITCH_OVERDUE_TABLE, { type: "vessel" }),
    fx.api(["vessel", "get", "many"], {
      perPage: 1000,
      customerId,
    }),
    fx.api(["overdue", "get", "one"], { perPage: 1000, customerId }),
    fx.api(["tag", "get", "many"], { perPage: 1000 }),
    fx.fetchApi({
      req: `/task/?vessel_id=${id}`,
      success: "api/get-many-task-success",
      failure: "api/get-many-task-failure",
    }),
    fx.api(["crew", "get", "many"], { perPage: 1000 }),
    fx.api(["customer", "get", "many"], { perPage: 1000 }),
    fx.api(["crewoverdue", "get", "one"], { perPage: 1000 }),
    fx.api(["vessel-document", "get", "many"], { vesselId: id, perPage: 1000 }),
  ];
});

regEventFx(vesselEvent.SHOW_CREW_LIST, () => [
  fx.db(R.assocPath(["vesselList", "showCrewList"], true)),
]);
regEventFx(vesselEvent.HIDE_CREW_LIST, () => [
  fx.db(R.assocPath(["vesselList", "showCrewList"], false)),
]);
regEventFx(vesselEvent.SHOW_CREW_ASSIGN, () => [
  fx.db(R.assocPath(["vesselList", "showCrewAssign"], true)),
]);
regEventFx(vesselEvent.HIDE_CREW_ASSIGN, () => [
  fx.db(R.assocPath(["vesselList", "showCrewAssign"], false)),
]);
regEventFx(routeIds.VESSEL_EDIT, onEdit("vessel", routeIds.VESSEL_DETAIL));
regEventFx(vesselEvent.DOWNLOAD_DOCUMENT, ({ db }, { id }) => [
  fx.fetchApi({
    req: `/vesseldocument/${id}`,
    success: "api/get-document-success",
    failure: "api/get-document-failure",
  }),
]);
regEventFx(vesselEvent.DELETE_DOCUMENT, ({ db }, { id }) => {
  return [
    fx.api(
      ["vessel-document", "delete", "one"],
      { id },
      { onSuccess: "api/delete-vessel-document-success" }
    ),
  ];
});
regFormSubmitHandler(
  ["vessel", "edit"],
  ({ db, form }: { db: any; form: any }) => {
    const validateResult = validateForm(form, validations);
    if (validateResult === true) {
      let payload = R.pipe(R.omit(["created"]))(form);
      const user = getCurrentUser(db);
      if (isCustomerAdmin(user)) {
        const sCustomerId = getSubCustomerId();
        const subCustomer = getCustomer(sCustomerId)(db);
        if (subCustomer) {
          payload["customerId"] = sCustomerId;
        }
      } else if (user) {
        payload["customerId"] = user.customerId;
      }
      return [
        setSubmittingFx(true),
        fx.api(["vessel", "update", "one"], { id: form.id, payload }),
      ];
    } else {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
  }
);
regFormSubmitHandler(
  ["vessel", "create"],
  ({ db, form }: { db: any; form: any }) => {
    const validateResult = validateForm(form, validations);
    if (validateResult === true) {
      let payload = R.pipe(R.omit(["created"]))(form);
      const user = getCurrentUser(db);
      if (isCustomerAdmin(user)) {
        const sCustomerId = getSubCustomerId();
        const subCustomer = getCustomer(sCustomerId)(db);
        if (subCustomer) {
          payload["customerId"] = sCustomerId;
        }
      } else if (user) {
        payload["customerId"] = user.customerId;
      }
      return [
        setSubmittingFx(true),
        fx.api(["vessel", "create", "one"], { id: form.id, payload }),
      ];
    } else {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
  }
);
regFormSubmitHandler(["vessel", "delete"], ({ db }, { form }) => {
  let customerId = null;
  const user = getCurrentUser(db);
  if (isCustomerAdmin(user)) {
    const sCustomerId = getSubCustomerId();
    const subCustomer = getCustomer(sCustomerId)(db);
    if (subCustomer) {
      customerId = sCustomerId;
    }
  } else if (user) {
    customerId = user.customerId;
  }
  return [
    fx.api(["vessel", "delete", "one"], {
      id: form.id,
      customerId: customerId,
    }),
  ];
});
const submitFileFx = (file: File, vesselId: string, objId?: String) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "ship_particulars",
      replaceDoc: true,
      file,
      objId: vesselId,
    },
    {
      onSuccess: "api/s3-presign-ship-particular-success",
    }
  );
regEventFx("api/s3-presign-ship-particular-success", ({ db }, rsp) => {
  const form = getForms(db).vessel;
  const file = form?.vessel_particulars;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.route(routeIds.VESSEL_DETAIL, { id: form.id }),
  ];
});
regEventFx("api/update-one-vessel-success", ({ db }, { id }) => {
  const form = getForms(db).vessel;
  const file = form?.vessel_particulars;
  let fileFx = [];
  if (file) {
    if (file === "deleted") {
      fileFx.push(
        fx.dispatch(vesselEvent.DELETE_DOCUMENT, {
          id: form["vessel_particulars_deleted"],
        })
      );
      fileFx.push(setSubmittingFx(false));
      fileFx.push(fx.route(routeIds.VESSEL_DETAIL, { id }));
    } else {
      fileFx.push(submitFileFx(file, vesselId, id));
    }
  } else {
    fileFx.push(setSubmittingFx(false));
    fileFx.push(fx.route(routeIds.VESSEL_DETAIL, { id }));
  }
  return fileFx;
});

regEventFx("api/create-one-vessel-success", ({ db }, { id }) => {
  const form = getForms(db).vessel;
  const file = form?.vessel_particulars;
  return [
    ...(file
      ? [submitFileFx(file, id)]
      : [setSubmittingFx(false), fx.route(routeIds.VESSEL_DETAIL, { id })]),
  ];
});

regEventFx("api/update-one-vessel-failure", (_, { id }) => [
  setSubmittingFx(false),
]);

// regEventFx(vesselEvent.DELETE_VESSEL, ({ db }, { id }) => {
//   return [fx.emit(vesselEvent.DELETE_VESSEL, { id })]
// })
//
// regResultFx(
//   vesselEvent.DELETE_VESSEL,
//   (_, { request }) => {
//     return [fx.db(R.dissocPath(['data', 'vessels', request.id]))]
//   },
//   (_, { request, error }) => {
//     return [fx.db(R.assocPath(['errors', 'deleteVessel'], { request, error }))]
//   },
// )

regEventFx("api/get-document-success", ({ db }, response) => {
  if (response.json && response.json.document_url) {
    const downloadUrl = response.json.document_url;
    const fileName = response.json.document_name;
    saveAs(downloadUrl, fileName);
  }
});
regEventFx("api/get-document-success-fully", ({ db }, response) => {
  const docId = R.last(response.url.split("/"));
  const doc = R.find(R.propEq("id", docId))(
    R.values(R.pathOr({}, ["data", "vessel-document"], db))
  );
  let fileName = !doc ? "ships-particulars.pdf" : doc.fileName;
  saveAs(response.blob, fileName);
});
regEventFx("api/get-many-task-success", (_, { json: { items: tasks } }) => {
  console.log("loaded tasks", tasks);
});
regEventFx("api/get-many-task-failure", (_, e) => {
  console.log("failed to load tasks", e);
});
regEventFx("api/delete-one-vessel-success", ({ db }, {}) => {
  const form = getForms(db)["vessel"];
  return [
    fx.db(R.dissocPath(["forms", "vessel"])),
    fx.db(R.dissocPath(["data", "vessel", form.id])),
    fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_LIST]),
  ];
});

regEventFx(vesselEvent.UPDATE_VESSEL_CREW, (_, { vesselId, crew, add }) => {
  if (add == true) {
    crew.assignedVessels.push(vesselId);
  } else {
    crew.assignedVessels = R.filter(
      (v, vesseId) => v != vesselId,
      crew.assignedVessels
    );
  }

  return [
    setProcessingFx(crew.id, true),
    fx.api(["crew", "update", "one"], { id: crew.id, payload: crew }),
  ];
});
regEventFx("api/get-many-tag-success", (_, res) => {
  return [fx.db(R.assocPath(["data", "vessels_tags"], res.items[0]))];
});
regEventFx("api/get-many-tag-failure", (_, { json }) => {
  return [fx.db(R.assocPath(["data", "vessels_tags"], {}))];
});
regEventFx(vesselEvent.UPDATE_TAGS, ({ db }, { type, tag }) => {
  let payload = R.pathOr(false, ["data", "vessels_tags"], db);
  if (payload) {
    payload[type].push(tag);
    if (payload.id) {
      return [fx.api(["tag", "update", "one"], { id: payload.id, payload })];
    } else {
      return [fx.api(["tag", "create", "one"], { payload })];
    }
  }
});
regEventFx("api/create-one-tag-success", (_, res) => {
  return [fx.db(R.assocPath(["data", "vessels_tags"], res))];
});
regEventFx("api/create-one-tag-failure", (_, res) => {});
regEventFx("api/update-one-tag-success", (_, res) => {
  return [fx.db(R.assocPath(["data", "vessels_tags"], res))];
});
regEventFx("api/update-one-tag-failure", (_, res) => {});

regEventFx("api/get-many-vessel-document-success", ({ db }, { items }) => {
  return [fx.db(R.assocPath(["data", "vessel-document"], items))];
});
regEventFx("api/create-one-vessel-document-success", ({ db }) => {
  const vesselId = R.path(["router", "match", "params", "id"], db);
  return [
    fx.api(["vessel-document", "get", "many"], {
      vesselId: vesselId,
      perPage: 1000,
    }),
  ];
});
regEventFx("api/delete-vessel-document-success", ({ db }) => {
  const vesselId = R.path(["router", "match", "params", "id"], db);
  return [
    fx.api(["vessel-document", "get", "many"], {
      vesselId: vesselId,
      perPage: 1000,
    }),
  ];
});
regEventFx(vesselEvent.SORT_TABLE, ({}, { table, key, dir }) => {
  return [fx.db(R.assocPath(["table", table, "sort"], [key, dir]))];
});

regEventFx(vesselEvent.SWITCH_OVERDUE_TABLE, (_, { type }) => [
  fx.db(R.assocPath(["vesselList", "overdueTableType"], type)),
]);
