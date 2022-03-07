import * as R from "ramda";
import { derive } from "framework-x";
import { Vessel, Db } from "../vessels/db";
// import { Db } from '../store'
import { createSelector } from "reselect";
import { routeIds, RouteIds } from "./events";
import { getLocationAndMatch } from "./selectors";
import {
  getVessel,
  routeToEntityName as vesselRouteToEntityName,
} from "../vessels/selectors";
import { routeToEntityName as crewRouteToEntityName } from "../crew/selectors";
import { Route, routes } from "./routes";
import { pathToRegexp } from "path-to-regexp";
import { exists } from "../../gen/ts";
import { makeFormSelector } from "../forms/selectors";
import { getCrew } from "crew/selectors";
import { getCustomerList } from "customers/selectors";
import { dispatch } from "store";

const memoize = (fn) => fn;

const toRegex = memoize((path) => {
  const keys = [];
  // @ts-ignore
  const pattern = pathToRegexp(path, keys);
  return {
    pattern,
    keys,
  };
});

const getRouteLabelMap = R.always({
  [routeIds.VESSEL_LIST]: "Vessels",
  [routeIds.CREW_LIST]: "Crew",
  [routeIds.USER_LIST]: "User",
  [routeIds.SETTINGS]: "Settings",
  [routeIds.CUSTOMER_LIST]: "Customers",
});

const matchAgainstPattern = ({ path }) => (uri) => {
  const { pattern, keys } = toRegex(path);
  const match = pattern.exec(uri);
  if (!match) return null;
  const params = Object.create(null);
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] = match[i];
  }
  return params;
};
const getDb = (db: Db) => db;
const matches = (routes, uri) =>
  routes
    .map((route) => ({ ...route, params: matchAgainstPattern(route)(uri) }))
    .filter(({ params }) => params);

const matchFirst = (routes, uri) => matches(routes, uri)[0];
const ucFirst = (str: String) => str.charAt(0).toUpperCase() + str.slice(1);
export const getBreadcrumbs = derive(
  [getLocationAndMatch, getRouteLabelMap, getDb],
  (locationAndMatch, routeLabels, db) => {
    console.log(db);
    const { location, match } = locationAndMatch;
    if (!match) return [];
    const { pathname } = location;
    const { route } = match;
    if (route.path === "/") {
      return [R.assoc("label", "Home", route)];
    }
    // get each parent path
    const parts = pathname.slice(1).split("/");
    let explodedSegments = [];
    for (let i = 0; i < parts.length; i++) {
      explodedSegments[i] = "/" + parts.slice(0, i + 1).join("/");
    }

    explodedSegments.unshift("/");

    // match each path segment to a route
    const matchedRoutes = R.map((x) => matchFirst(routes, x), explodedSegments);
    // add labels to each matched route
    return R.tail(matchedRoutes).map((x) => {
      if (x.path === "/") {
        return R.assoc("label", "Home", x);
      }
      const routeId = R.prop("id", x);
      let label = "";
      if (exists(routeLabels, routeId)) {
        label = routeLabels[routeId];
      } else if (exists(vesselRouteToEntityName, routeId)) {
        label = vesselRouteToEntityName[routeId]["label"];
      } else if (exists(crewRouteToEntityName, routeId)) {
        label = crewRouteToEntityName[routeId]["label"];
      } else if (["edit", "add"].includes(routeId.split("/").reverse()[0])) {
        label = ucFirst(routeId.split("/").reverse()[0]);
      } else {
        const vId: String = R.path(["params", "id"], x);
        const formNames = {
          [routeIds.VESSEL_CERTS_DETAIL]: "vesselcert",
          [routeIds.VESSEL_MAINT_DETAIL]: "maintenance",
          [routeIds.VESSEL_AUDITS_DETAIL]: "audit",
          [routeIds.VESSEL_SURVEYS_DETAIL]: "survey",
          [routeIds.VESSEL_REVIEWS_DETAIL]: "review",
          [routeIds.VESSEL_DRILLS_DETAIL]: "drill",
          [routeIds.VESSEL_TRAINING_DETAIL]: "training",
          [routeIds.VESSEL_EQUIP_DETAIL]: "safetyequipment",
          [routeIds.VESSEL_SAFETY_DETAIL]: "health",
          [routeIds.VESSEL_PARTS_DETAIL]: "part",
          [routeIds.VESSEL_ACTIONS_DETAIL]: ["action", "action"],
          [routeIds.CREW_CERTS_DETAIL]: ["crewcert", "qualification"],
        };
        console.log(db);
        switch (routeId) {
          case routeIds.VESSEL_DETAIL:
            let vessel = getVessel(db);
            if (vessel && vessel[vId]) {
              label = vessel[vId].name;
            }
            break;
          case routeIds.CREW_CERTS_DETAIL:
          case routeIds.VESSEL_CERTS_DETAIL:
          case routeIds.VESSEL_MAINT_DETAIL:
          case routeIds.VESSEL_AUDITS_DETAIL:
          case routeIds.VESSEL_REVIEWS_DETAIL:
          case routeIds.VESSEL_SURVEYS_DETAIL:
          case routeIds.VESSEL_DRILLS_DETAIL:
          case routeIds.VESSEL_TRAINING_DETAIL:
          case routeIds.VESSEL_EQUIP_DETAIL:
          case routeIds.VESSEL_SAFETY_DETAIL:
          case routeIds.VESSEL_PARTS_DETAIL:
          case routeIds.VESSEL_ACTIONS_DETAIL:
            let form = R.path(
              [
                "forms",
                typeof formNames[routeId] == "string"
                  ? formNames[routeId]
                  : formNames[routeId][0],
              ],
              db
            );
            if (form) {
              label =
                form[
                  typeof formNames[routeId] == "string"
                    ? "name"
                    : formNames[routeId][1]
                ];
            } else {
              label = R.pathOr("", ["params", "id"], x) || "?";
            }
            break;

          // case routeIds.VESSEL_DRILLS_DETAIL:
          //     let drill = R.path(['data', 'drill'], db)
          //     if (drill[vId]) {
          //       label = drill[vId]['name'];
          //     }
          //     break;
          case routeIds.CREW_DETAIL:
            let crew = getCrew(db);
            if (crew[vId]) {
              label = `${crew[vId].firstname}  ${crew[vId].lastname}`;
            }
            break;
          case routeIds.CREW_CERTS_DETAIL:
            label = "Certs";
            break;
          default:
            label = R.pathOr("", ["params", "id"], x) || "?";
        }
      }
      return R.assoc("label", label, x);
    });
  }
);
