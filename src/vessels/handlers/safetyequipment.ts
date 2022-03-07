import { dispatch, fx, regEventFx } from "../../store";
import { SafetyEquipmentFromJSON } from "../../../gen/ts/models";
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
  { name: "tag", rule: "required" },
  { name: "date_issued", rule: "date|required" },
  { name: "expiry_date", rule: "date" },
];

regFormSubmitHandler(["safetyequipment", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = SafetyEquipmentFromJSON(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["safetyequipment", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["safetyequipment", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = SafetyEquipmentFromJSON(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["safetyequipment", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["safetyequipment", "delete"], (_, { form }) => {
  const payload = SafetyEquipmentFromJSON(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["safetyequipment", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "safetyequipment",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-safetyequipment-success",
    }
  );

regEventFx("api/s3-presign-safetyequipment-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  return [
    uploadToS3(rsp, file),
    setSubmittingFx(false),
    fx.dispatch(routeEvent.BACK),
  ];
});

// TODO: auto-add these via the api handler?
regEventFx(
  "api/update-one-safetyequipment-success",
  ({ db }, { vesselId, id }) => {
    const form = getSelectedSubItemForm(db);
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
              type: "safetyequipment",
              tag: newTag,
            }),
          ]
        : []),
      ...fileFx,
    ];
  }
);

regEventFx(
  "api/create-one-safetyequipment-success",
  ({ db }, { vesselId, id }) => {
    console.log("finished creating.", vesselId, id);
    const form = getSelectedSubItemForm(db);
    const file = form?.attachment;
    const newTag = form?.new_tag ? form.tag : false;
    return [
      ...(newTag
        ? [
            fx.dispatch(vesselEvent.UPDATE_TAGS, {
              type: "safetyequipment",
              tag: newTag,
            }),
          ]
        : []),
      ...(file
        ? [submitFileFx(file, vesselId, id)]
        : [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)]),
    ];
  }
);

regEventFx("api/delete-one-safetyequipment-success", ({ db }, {}) => {
  const form = getForms(db)["safetyequipment"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "safetyequipment"])),
    fx.db(R.dissocPath(["data", "safetyequipment", form.id])),
    fx.route(routeIds.VESSEL_EQUIP, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-safetyequipment-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-safetyequipment-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-safetyequipment-failure", () => {
  return [setSubmittingFx(false)];
});
