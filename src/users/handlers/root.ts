import * as R from "ramda";
import { fx, regEventFx } from "../../store";
import { routeIds } from "../../routes/events";
import { regFormSubmitHandler } from "forms/handlers";
import { UserCreateFromJSONTyped } from "../../../gen/ts";
import {
  deSelectItemFx,
  onEdit,
  setProcessingFx,
  setShowRestPwdFormFx,
  setSubmittingFx,
  validateForm,
} from "forms/helpers";
import { formEvt } from "forms/events";
import { userEvent as evt } from "./events";
import { readTokenInfo } from "auth/handlers";
import { getCurrentUser, getCurrentUserId } from "users/selectors";
import { isRoot, isCustomerAdmin } from "../../util";

regEventFx(routeIds.USER_LIST, ({ db }) => {
  return [
    deSelectItemFx("user"),
    fx.api(["user", "get", "many"], { perPage: 1000 }),
    fx.api(["customer", "get", "many"], { perPage: 1000 }),
  ];
});
regEventFx(routeIds.USER_ADD, (_) => {
  return [
    fx.db(R.assocPath(["forms", "user"], {})),
    fx.api(["customer", "get", "many"], { perPage: 1000 }),
  ];
});
regEventFx(routeIds.USER_EDIT, onEdit("User", routeIds.USER_DETAIL));
regEventFx(routeIds.USER_DETAIL, ({ db }, { id }) => [
  fx.api(["user", "get", "one"], { id }),
]);
regEventFx(evt.RESET_USER_PWD, ({ db }, { id }) => [
  fx.db(R.assocPath(["forms", "user"], R.path(["data", "user", id], db))),
  setShowRestPwdFormFx(true),
]);
regEventFx(routeIds.USER_DELETE, ({ db }, { id }) => [
  deSelectItemFx("user"),
  setProcessingFx(id, true),
  fx.api(["user", "delete", "one"], { id }),
]);

regFormSubmitHandler(
  ["user", "create"],
  ({ db, form }: { db: any; form: any }) => {
    const currentUser = getCurrentUser(db);
    let validations: Array<{ name: string; rule: string }> = [
      { name: "fullname", rule: "required" },
      { name: "email", rule: "required" },
      { name: "role", rule: "required" },
    ];
    if (isRoot(currentUser) || isCustomerAdmin(currentUser)) {
      validations.push({ name: "customer_id", rule: "required" });
    }
    const validateResult = validateForm(form, validations);
    if (validateResult === true) {
      const payload = UserCreateFromJSONTyped(form, true);
      if (
        !payload["password"] ||
        payload["password"] != payload["confirmPassword"]
      ) {
        return [
          fx.toast({
            status: "error",
            title: "The password and confirm password don't match.",
          }),
        ];
      }
      return [
        setSubmittingFx(true),
        fx.api(["user", "create", "one"], { payload }),
      ];
    } else {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
  }
);
regFormSubmitHandler(
  ["user", "edit"],
  ({ db, form }: { db: any; form: any }) => {
    const payload = UserCreateFromJSONTyped(form, true);
    if (
      !payload["password"] ||
      payload["password"] != payload["confirmPassword"]
    ) {
      return [
        fx.toast({
          status: "error",
          title: "The password and confirm password don't match.",
        }),
      ];
    }
    return [
      setProcessingFx(form.id, true),
      setSubmittingFx(true),
      deSelectItemFx("user"),
      fx.api(["user", "update", "one"], { id: form.id, payload }),
    ];
  }
);
regEventFx("api/create-one-user-success", ({ db }, { id }) => {
  return [
    setSubmittingFx(false),
    fx.api(["user", "get", "many"], { perPage: 1000 }),
    fx.route(routeIds.USER_DETAIL, { id }),
  ];
});
regEventFx("api/create-one-user-failure", ({ db }, p) => {
  return [setSubmittingFx(false)];
});
regEventFx("api/update-one-user-success", ({ db }, { id }) => {
  const curRoute = R.pathOr(
    "not-found",
    ["router", "match", "route", "id"],
    db
  );
  if (curRoute == routeIds.USER_LIST) {
    return [
      fx.db(R.dissocPath(["forms", "user"])),
      setSubmittingFx(false),
      fx.api(["user", "get", "many"], { perPage: 1000 }),
      setProcessingFx(id, false),
    ];
  } else {
    return [
      setSubmittingFx(false),
      setProcessingFx(id, false),
      fx.api(["user", "get", "many"], { perPage: 1000 }),
      fx.route(routeIds.USER_DETAIL, { id }),
    ];
  }
});
regEventFx("api/get-many-task-success", (_, { json: { items: tasks } }) => {
  console.log("loaded tasks", tasks);
});
regEventFx("api/delete-one-user-success", ({ db }, args) => {
  const url = args.raw.url; //delete api url
  const id = R.last(R.split("/", url));
  console.log("deleted id", id);
  return [
    setProcessingFx(id, false),
    fx.api(["user", "get", "many"], { perPage: 1000 }),
    fx.db(R.dissocPath(["data", "user", id])),
  ];
});
regEventFx("api/get-many-task-failure", (_, e) => {
  console.log("failed to load tasks", e);
});
