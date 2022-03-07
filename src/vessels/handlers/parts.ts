import * as R from "ramda";
import { dispatch, fx, regEventFx } from "../../store";
import { PartFromJSONTyped } from "../../../gen/ts/models";
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
  { name: "location", rule: "required" },
  { name: "date_added", rule: "date" },
];

regFormSubmitHandler(["part", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = PartFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["part", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["part", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = PartFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["part", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["part", "delete"], (_, { form }) => {
  const payload = PartFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["part", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "part",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-parts-success",
    }
  );

regEventFx("api/s3-presign-parts-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});

// TODO: auto-add these via the api handler?
regEventFx("api/update-one-part-success", ({ db }, { vesselId, id }) => {
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

regEventFx("api/create-one-part-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
  ];
});

regEventFx("api/delete-one-part-success", ({ db }, {}) => {
  const form = getForms(db)["part"];
  return [
    fx.db(R.dissocPath(["forms", "part"])),
    fx.db(R.dissocPath(["data", "part", form.id])),
    fx.route(routeIds.VESSEL_PARTS, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-part-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-part-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-part-failure", () => {
  return [setSubmittingFx(false)];
});
