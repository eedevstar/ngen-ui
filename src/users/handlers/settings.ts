import * as R from "ramda";
import { fx, regEventFx } from "../../store";
import { routeEvent, routeIds } from "routes/events";
import { getCurrentUserId } from "users/selectors";
import { onEdit, setSubmittingFx } from "forms/helpers";
import { UserSettingFromJSONTyped } from "../../../gen/ts";
import { regFormSubmitHandler } from "forms/handlers";
regEventFx(routeIds.SETTINGS, ({ db }) => {
  const userId = getCurrentUserId();
  return [fx.api(["usersetting", "get", "one"], { id: userId })];
});

regEventFx(routeIds.SETTINGS_EDIT, ({ db }) => {
  const userId = getCurrentUserId();
  return [fx.api(["usersetting", "get", "one"], { id: userId })];
});

regEventFx("api/get-one-usersetting-success", ({ db }, res) => {
  return [fx.db(R.assocPath(["forms", "usersetting"], res, db))];
});

regFormSubmitHandler(["usersetting", "edit"], (_, { form }) => {
  return [
    setSubmittingFx(true),
    fx.api(["usersetting", "update", "one"], {
      id: form.userId,
      payload: form,
    }),
  ];
});

regEventFx("api/update-one-usersetting-success", ({ db }, { _ }) => {
  return [setSubmittingFx(false)];
});
regEventFx("api/update-one-usersetting-failure", ({ db }, { _ }) => {
  return [setSubmittingFx(false)];
});
