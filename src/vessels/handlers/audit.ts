import { dispatch, fx, regEventFx } from "../../store";
import { AuditFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { updateIn } from "../../util";
import { routeEvent, routeIds } from "../../routes/events";
import * as R from "ramda";
import { getSelectedSubItemForm, getSelectedVesselId } from "../selectors";
import { getForms } from "forms/selectors";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../../util";
import { vesselEvent } from "vessels/events";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "due_date", rule: "date" },
  { name: "completed_date", rule: "date" },
];

regFormSubmitHandler(["audit", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = AuditFromJSONTyped(form, true);

    return [
      setSubmittingFx(true),
      fx.api(["audit", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["audit", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = AuditFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["audit", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["audit", "delete"], (_, { form }) => {
  const payload = AuditFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["audit", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "audit",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-audit-success",
    }
  );

regEventFx("api/s3-presign-audit-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});
// TODO: auto-add these via the api handler?
regEventFx("api/update-one-audit-success", ({ db }, { vesselId, id }) => {
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

regEventFx("api/create-one-audit-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-audit-success", ({ db }, {}) => {
  const form = getForms(db)["audit"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "audit"])),
    fx.db(R.dissocPath(["data", "audit", form.id])),
    fx.route(routeIds.VESSEL_AUDITS, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-audit-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-audit-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-audit-failure", () => {
  return [setSubmittingFx(false)];
});
