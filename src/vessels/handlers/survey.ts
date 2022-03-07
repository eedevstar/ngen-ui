import { dispatch, fx, regEventFx } from "../../store";
import { SurveyFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
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

regFormSubmitHandler(["survey", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = SurveyFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["survey", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["survey", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = SurveyFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["survey", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["survey", "delete"], (_, { form }) => {
  const payload = SurveyFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["survey", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "survey",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-survey-success",
    }
  );

regEventFx("api/s3-presign-survey-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});
// TODO: auto-add these via the api handler?
regEventFx("api/update-one-survey-success", ({ db }, { vesselId, id }) => {
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

regEventFx("api/create-one-survey-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-survey-success", ({ db }, {}) => {
  const form = getForms(db)["survey"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "survey"])),
    fx.db(R.dissocPath(["data", "survey", form.id])),
    fx.route(routeIds.VESSEL_SURVEYS, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-survey-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-survey-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-survey-failure", () => {
  return [setSubmittingFx(false)];
});
