import { formEvt } from "forms/events";
import { regFormSubmitHandler } from "forms/handlers";
import { setSubmittingFx, validateForm } from "forms/helpers";
import * as R from "ramda";
import { dispatch, fx, regEventFx } from "../../store";
import { RepairFromJSONTyped } from "../../../gen/ts";
import { getSelectedSubItemForm } from "vessels/selectors";
import { routeEvent, routeIds } from "routes/events";
import { getForms } from "forms/selectors";

const validations: Array<{ name: string; rule: string }> = [
  { name: "description", rule: "required" },
  { name: "priority", rule: "required" },
  { name: "required_action", rule: "required" },
  { name: "reported_date", rule: "required|date" },
  { name: "due_date", rule: "date" },
  { name: "date_completed", rule: "date" },
];

regFormSubmitHandler(["requests", "edit"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = RepairFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["requests", "update", "one"], { id: form.id, payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["requests", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = RepairFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.api(["requests", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["requests", "delete"], (_, { form }) => {
  const payload = RepairFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["requests", "delete", "one"], { id: form.id }),
  ];
});

// TODO: auto-add these via the api handler?
regEventFx("api/update-one-requests-success", ({ db }, { vesselId, id }) => {
  return [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)];
});

regEventFx("api/create-one-requests-success", ({ db }, { vesselId, id }) => {
  return [setSubmittingFx(false), fx.dispatch(routeEvent.BACK)];
});

regEventFx("api/delete-one-requests-success", ({ db }, {}) => {
  const form = getForms(db)["requests"];
  return [
    fx.db(R.dissocPath(["forms", "requests"])),
    fx.db(R.dissocPath(["data", "requests", form.id])),
    fx.route(routeIds.VESSEL_REPAIRS, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-requests-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-requests-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-requests-failure", () => {
  return [setSubmittingFx(false)];
});
