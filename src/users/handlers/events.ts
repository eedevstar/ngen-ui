import { routeIds } from "../../routes/events";

export const userEvent = {
  SELECT_USER: "user/select",
  DESELECT_USER: "user/deselect",
  RESET_USER_PWD: "user/resets-pwd",
} as const;

export type UserEventPayloads = {
  [routeIds.USER_LIST]: any;
  [routeIds.USER_DETAIL]: { id: string };
  [userEvent.SELECT_USER]: { id: string };
  [userEvent.DESELECT_USER]: { id: string };
  [userEvent.RESET_USER_PWD]: { id: string };
};
