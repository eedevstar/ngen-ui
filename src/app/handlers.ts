import { dispatch, fx, regEventFx } from "../store";
import { evt } from "./events";
import * as R from "ramda";
import cookie from "react-cookies";
import { getCurrentUser, getCurrentUserId } from "users/selectors";
import { history } from "routes";
import { getRoute } from "routes/selectors";

regEventFx(evt.SHOW_CONFIRM_MODAL, () => {
  return [fx.db(R.assoc("isConfirmOpen", true))];
});

regEventFx(evt.HIDE_CONFIRM_MODAL, () => {
  return [
    fx.db(R.dissoc("confirmDeleteOnModal")),
    fx.db(R.dissoc("isConfirmOpen")),
  ];
});

regEventFx(evt.TOGGLE_CONFIRM_DELETE, (db, checked) => {
  return [fx.db(R.assoc("confirmDeleteOnModal", checked))];
});
regEventFx(evt.AGREE_COOKIE_CONSENT, () => {
  const expires = new Date();
  expires.setTime(Date.now() + 60 * 60 * 24 * 365 * 1000);
  cookie.save("agree_cookie", 1, { expires: expires });
  return [fx.db(R.assoc("agree_cookie", 1))];
});
regEventFx(evt.INITIAL_DATA_LOAD, () => {
  //Load users data to check the role of the user
  return [
    fx.db(R.assocPath(["app", "initialize-status"], "processing")),
    fx.api(
      ["user", "get", "many"],
      { perPage: 1000 },
      {
        onSuccess: "init-user-data-success",
      }
    ),
  ];
});
regEventFx("init-user-data-success", ({ db }, _) => {
  //reload current action
  const routeInfo = R.path(["router", "match"], db);
  return [fx.route(routeInfo.route.id, routeInfo.params)];
});
