import * as R from "ramda";
import { dispatch, fx, regEventFx } from "../../store";
import { ActionFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { routeEvent, routeIds } from "../../routes/events";
import { getSelectedSubItemForm, getSelectedVesselId } from "../selectors";
import { getForms } from "forms/selectors";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../../util";
import { vesselEvent } from "vessels/events";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "date_issued", rule: "date" },
  { name: "date_completed", rule: "date" },
  { name: "fix_by_date", rule: "date" },
];

regFormSubmitHandler(["action", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = ActionFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["action", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["action", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = ActionFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["action", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["action", "delete"], (_, { form }) => {
  const payload = ActionFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["action", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "action",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-corrective-success",
    }
  );

regEventFx("api/s3-presign-corrective-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});

// TODO: auto-add these via the api handler?
regEventFx("api/update-one-action-success", ({ db }, { vesselId, id }) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
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
  return fileFx;
});

regEventFx("api/create-one-action-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-action-success", ({ db }, {}) => {
  const form = getForms(db)["action"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "action"])),
    fx.db(R.dissocPath(["data", "action", form.id])),
    fx.route(routeIds.VESSEL_ACTIONS, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-action-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-action-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-action-failure", () => {
  return [setSubmittingFx(false)];
});
