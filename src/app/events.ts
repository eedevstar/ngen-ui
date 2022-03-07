export const evt = {
  INITIALIZE_APP: "app/initialize",
  INITIAL_DATA_LOAD: "initial-data/load",
  INITIAL_DATA_LOADED: "initial-data/loaded",
  CHECK_PERMISSION: "app/check-permission",
  SOCKET_CONNECTED: "socket/connected",
  SOCKET_DISCONNECTED: "socket/disconnected",
  SHOW_CONFIRM_MODAL: "confirm/show",
  HIDE_CONFIRM_MODAL: "confirm/hide",
  TOGGLE_CONFIRM_DELETE: "confirm/toggle",
  AGREE_COOKIE_CONSENT: "confirm/cookie",
} as const;

export type BaseEventPayloads = {
  [evt.INITIALIZE_APP]: any;
  [evt.INITIAL_DATA_LOAD]: any;
  [evt.INITIAL_DATA_LOADED]: any;
  [evt.CHECK_PERMISSION]: any;
  [evt.SOCKET_CONNECTED]: any;
  [evt.SOCKET_DISCONNECTED]: any | undefined;
  [evt.SHOW_CONFIRM_MODAL]: any | undefined;
  [evt.HIDE_CONFIRM_MODAL]: any | undefined;
  [evt.TOGGLE_CONFIRM_DELETE]: any | undefined;
  [evt.AGREE_COOKIE_CONSENT]: any | undefined;
};
