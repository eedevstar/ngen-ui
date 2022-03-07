import { dispatch, fx, regEventFx } from "../store";
import { authEvent } from "./events";
import { API_BASE_PATH } from "config";
import { evt } from "../app/events";
import jwt_decode from "jwt-decode";
import { routeIds } from "../routes/events";
import * as R from "ramda";
import { setSubCustomerId, setSubmittingFx } from "forms/helpers";
const TOKEN_KEY = "auth-token-info";

/**
 * Check whether a decoded token is expired or within 5 seconds of expiration
 * @param token
 */
export const expired = (token: { exp: number }) => {
  const { exp } = token;
  const now = Date.now() / 1000;
  return exp + 5 < now;
};

export const readTokenInfo = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};

const scheduleRefreshFx = (tokenInfo) => {
  if (!tokenInfo) return ["noop"];
  const access = jwt_decode(tokenInfo.access_token);
  const delay = Math.max(0, 1000 * (access.exp - 5 * 60) - Date.now());
  // const delay = 10000
  console.log("scheduling refresh with delay", delay, access);
  return fx.schedule("refresh-token", delay, () => {
    dispatch(authEvent.REFRESH_TOKEN);
  });
};

regEventFx(evt.INITIALIZE_APP, () => {
  // since no coeffects to read from local storage yet, going to do it here...
  const tokenInfo = readTokenInfo();
  if (!tokenInfo) {
    return [fx.redirect(routeIds.LOGIN, {})];
  }
  const { access_token, refresh_token } = tokenInfo;
  const access = jwt_decode(access_token);
  const refresh = jwt_decode(refresh_token);
  if (expired(refresh)) {
    // if the refresh token itself is expired, need to go back to login
    return [
      fx.writeStorage(TOKEN_KEY, JSON.stringify(null)),
      fx.cancelSchedule("refresh-token"),
      fx.redirect(routeIds.LOGIN, {}),
    ];
  }
  if (expired(access)) {
    // still have a valid refresh token, so can just refresh it if expired
    return [fx.dispatch(authEvent.REFRESH_TOKEN)];
  }
  return [scheduleRefreshFx(tokenInfo)];
});

regEventFx(authEvent.REFRESH_TOKEN, () => {
  console.log("refreshing token...");
  const tokenInfo = readTokenInfo();
  if (!tokenInfo) {
    return [fx.redirect(routeIds.LOGIN, {})];
  }
  const { refresh_token } = tokenInfo;
  return [
    [
      "fetch",
      [
        {
          url: API_BASE_PATH + "/auth/refresh",
          body: JSON.stringify({ refresh_token }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
        authEvent.TOKEN_REFRESHED,
        authEvent.DENIED,
      ],
    ],
  ];
});

regEventFx(authEvent.LOGIN, (_, { username, password }) => {
  return [
    setSubmittingFx(true),
    [
      "fetch",
      [
        {
          url: API_BASE_PATH + "/auth/token",
          body: JSON.stringify({
            email: username,
            password,
            device_id: "mine",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
        authEvent.LOGGED_IN,
        authEvent.DENIED,
      ],
    ],
  ];
});

regEventFx(authEvent.LOGGED_IN, (_, { json }) => {
  return [
    setSubmittingFx(false),
    fx.dispatch(authEvent.TOKEN_REFRESHED, { json }),
    fx.route(routeIds.ROOT, {}),
  ];
});

regEventFx(authEvent.LOGOUT, () => {
  setSubCustomerId(null);
  return [fx.writeStorage(TOKEN_KEY, null), fx.route(routeIds.LOGIN)];
});

regEventFx(authEvent.TOKEN_REFRESHED, (_, { json }) => [
  fx.writeStorage(TOKEN_KEY, JSON.stringify(json)),
  scheduleRefreshFx(json),
  // REFRESH ALL DATA HERE. Should be same as on app start. Not going to worry about per-page refreshes.
  // OR could be as simple as triggering re-entry into existing route
  // which will trigger a reload of data
]);

regEventFx(authEvent.DENIED, (_, err) => {
  console.log("denied", err);
  var callbacks = [setSubmittingFx(false)];
  callbacks.push(fx.route(routeIds.LOGIN, {}));
  if (R.pathOr(null, ["json", "message"], err))
    callbacks.push(
      fx.toast({
        status: "error",
        title: "",
        description: err["json"]["message"],
      })
    );
  return callbacks;
});
