import { Values } from "../util";
import { LocationAndMatch } from "./index";
import * as R from "ramda";

export const routeEvent = {
  NAV_TO: "route/nav-to",
  CHANGED: "route/changed",
  BACK: "route/back",
} as const;

export type RouteEventPayloads = {
  [routeEvent.CHANGED]: LocationAndMatch;
  [routeEvent.NAV_TO]: [RouteIds, { [k: string]: any }]; // routeId, params
  [routeEvent.BACK]: never;
};

export const routeIds = {
  ROOT: "root",

  LOGIN: "login",
  SETTINGS: "settings/detail",
  SETTINGS_EDIT: "settings/edit",

  CUSTOMER_LIST: "customer/list",
  CUSTOMER_ADD: "customer/add",
  CUSTOMER_DETAIL: "customer/detail",
  CUSTOMER_EDIT: "customer/edit",
  CUSTOMER_DELETE: "customer/delete",

  CREW_ADD: "crew/add",
  CREW_DETAIL: "crew/detail",
  CREW_LIST: "crew/list",
  CREW_EDIT: "crew/edit",
  CREW_CERTS: "crew/route/cert-and-doc",
  CREW_CERTS_DETAIL: "crew/route/cert-and-doc/detail",
  CREW_CERTS_ADD: "crew/route/cert-and-doc/add",
  CREW_CERTS_EDIT: "crew/route/cert-and-doc/edit",

  USER_ADD: "user/add",
  USER_DETAIL: "user/detail",
  USER_LIST: "user/list",
  USER_EDIT: "user/edit",
  USER_DELETE: "user/delete",

  VESSEL_ADD: "vessel/add",
  VESSEL_DETAIL: "vessel/detail",
  VESSEL_LIST: "vessel/list",
  VESSEL_EDIT: "vessel/edit",

  // list
  VESSEL_CERTS: "vessel/route/cert-and-doc",
  VESSEL_AUDITS: "vessel/route/audit",
  VESSEL_SURVEYS: "vessel/route/survey",
  VESSEL_REVIEWS: "vessel/route/review",
  VESSEL_DRILLS: "vessel/route/drill",
  VESSEL_TRAINING: "vessel/route/training",
  VESSEL_EQUIP: "vessel/route/equip",
  VESSEL_SAFETY: "vessel/route/safety",
  VESSEL_MAINT: "vessel/route/maint",
  VESSEL_PARTS: "vessel/route/parts",
  VESSEL_ACTIONS: "vessel/route/actions",
  VESSEL_REPAIRS: "vessel/route/requests",

  // DETAIL
  VESSEL_CERTS_DETAIL: "vessel/route/cert-and-doc/detail",
  VESSEL_AUDITS_DETAIL: "vessel/route/audit/detail",
  VESSEL_SURVEYS_DETAIL: "vessel/route/survey/detail",
  VESSEL_REVIEWS_DETAIL: "vessel/route/review/detail",
  VESSEL_DRILLS_DETAIL: "vessel/route/drill/detail",
  VESSEL_TRAINING_DETAIL: "vessel/route/training/detail",
  VESSEL_EQUIP_DETAIL: "vessel/route/equip/detail",
  VESSEL_SAFETY_DETAIL: "vessel/route/safety/detail",
  VESSEL_MAINT_DETAIL: "vessel/route/maint/detail",
  VESSEL_PARTS_DETAIL: "vessel/route/parts/detail",
  VESSEL_ACTIONS_DETAIL: "vessel/route/actions/detail",
  VESSEL_REPAIRS_DETAIL: "vessel/route/requests/detail",

  // add
  VESSEL_CERTS_ADD: "vessel/route/cert-and-doc/add",
  VESSEL_AUDITS_ADD: "vessel/route/audit/add",
  VESSEL_SURVEYS_ADD: "vessel/route/survey/add",
  VESSEL_REVIEWS_ADD: "vessel/route/review/add",
  VESSEL_DRILLS_ADD: "vessel/route/drill/add",
  VESSEL_TRAINING_ADD: "vessel/route/training/add",
  VESSEL_EQUIP_ADD: "vessel/route/equip/add",
  VESSEL_SAFETY_ADD: "vessel/route/safety/add",
  VESSEL_MAINT_ADD: "vessel/route/maint/add",
  VESSEL_PARTS_ADD: "vessel/route/parts/add",
  VESSEL_ACTIONS_ADD: "vessel/route/actions/add",
  VESSEL_REPAIRS_ADD: "vessel/route/requests/add",

  // edit
  VESSEL_CERTS_EDIT: "vessel/route/cert-and-doc/edit",
  VESSEL_AUDITS_EDIT: "vessel/route/audit/edit",
  VESSEL_SURVEYS_EDIT: "vessel/route/survey/edit",
  VESSEL_REVIEWS_EDIT: "vessel/route/review/edit",
  VESSEL_DRILLS_EDIT: "vessel/route/drill/edit",
  VESSEL_TRAINING_EDIT: "vessel/route/training/edit",
  VESSEL_EQUIP_EDIT: "vessel/route/equip/edit",
  VESSEL_SAFETY_EDIT: "vessel/route/safety/edit",
  VESSEL_MAINT_EDIT: "vessel/route/maint/edit",
  VESSEL_PARTS_EDIT: "vessel/route/parts/edit",
  VESSEL_ACTIONS_EDIT: "vessel/route/actions/edit",
  VESSEL_REPAIRS_EDIT: "vessel/route/requests/edit",

  NOT_FOUND: "not-found",
} as const;

export type RouteIds = Values<typeof routeIds>;

export const vesselSubListRouteIds: Partial<typeof routeIds> = R.pipe(
  R.toPairs,
  R.filter(
    ([_, v]) =>
      v.includes("vessel/route/") &&
      !v.endsWith("/add") &&
      !v.endsWith("/edit") &&
      !v.endsWith("/detail")
  ),
  R.fromPairs
)(routeIds);
