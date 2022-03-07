import * as R from "ramda";
import { dispatch, fx, regEventFx } from "../../store";
import { MaintenanceFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { routeEvent, routeIds } from "../../routes/events";
import { getSelectedSubItemForm, getSelectedVesselId } from "../selectors";
import { getForms } from "forms/selectors";
import { vesselEvent } from "vessels/events";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../../util";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "due_date", rule: "date" },
  { name: "reminder_frq", rule: "required" },
  { name: "tag", rule: "required" },
];

regFormSubmitHandler(["maintenance", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = MaintenanceFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["maintenance", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["maintenance", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = MaintenanceFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["maintenance", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["maintenance", "delete"], (_, { form }) => {
  const payload = MaintenanceFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["maintenance", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "maintenance",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-maintenance-success",
    }
  );

regEventFx("api/s3-presign-maintenance-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});

// TODO: auto-add these via the api handler?
regEventFx("api/update-one-maintenance-success", ({ db }, { vesselId, id }) => {
  const form = getSelectedSubItemForm(db);
  console.log("form", form);
  const file = form?.attachment;
  const newTag = form?.new_tag ? form.tag : false;
  let fileFx = [];
  if (file) {
    if (file === "deleted") {
      fileFx.push(
        fx.dispatch(vesselEvent.DELETE_DOCUMENT, {
          id: form["attachment_deleted"],
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
  return [
    ...(newTag
      ? [
          fx.dispatch(vesselEvent.UPDATE_TAGS, {
            type: "maintenance",
            tag: newTag,
          }),
        ]
      : []),
    ...fileFx,
  ];
});

regEventFx("api/create-one-maintenance-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const newTag = form?.new_tag ? form.tag : false;
  return [
    ...(newTag
      ? [
          fx.dispatch(vesselEvent.UPDATE_TAGS, {
            type: "maintenance",
            tag: newTag,
          }),
        ]
      : []),
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-maintenance-success", ({ db }, {}) => {
  const form = getForms(db)["maintenance"];
  const newTag = form?.new_tag ? form.tag : false;
  return [
    fx.db(R.dissocPath(["forms", "maintenance"])),
    fx.db(R.dissocPath(["data", "maintenance", form.id])),
    fx.route(routeIds.VESSEL_MAINT, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-maintenance-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-maintenance-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-maintenance-failure", () => {
  return [setSubmittingFx(false)];
});
