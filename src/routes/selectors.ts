import queryString from "query-string";
import * as R from "ramda";
import { createSelector, Selector } from "reselect";
import { Db } from "../store";
import { LocationAndMatch } from "./index";
import { routeIds, RouteIds } from "./events";
import { Route, routes } from "./routes";
import cookie from "react-cookies";

const derive = createSelector;

export const getLocationAndMatch: Selector<Db, LocationAndMatch> = R.propOr(
  {},
  "router"
);

export const getMatch: Selector<Db, Route> = derive(
  [getLocationAndMatch],
  R.path(["match"])
);

export const getRoute: Selector<Db, Route> = derive(
  [getLocationAndMatch],
  R.path(["match", "route"])
);

export const getRouteId: Selector<Db, RouteIds> = R.pathOr("not-found", [
  "router",
  "match",
  "route",
  "id",
]);

export const getRouteParams: Selector<Db, { [k: string]: any }> = R.pathOr({}, [
  "router",
  "match",
  "params",
]);

export const getSearchString: Selector<Db, string> = R.pathOr("", [
  "router",
  "location",
  "search",
]);

export const getCookieConsent: Selector<Db, string> = R.pathOr(
  cookie.load("agree_cookie"),
  ["agree_cookie"]
);

export const getRouterQuery: Selector<
  Db,
  { [k: string]: any }
> = derive(getSearchString, (search) => queryString.parse(search));

// Returns all routes that precede the one provided as an argument according to its path pattern
// e.g. /scope/stories/123 -> /, /scope, /scope/stories /scope/stories/123
// Matches each path to its route id

// const routeHierarchy = (route): (Pick<Route, 'id' | 'path'> | {})[] | [] => {
//   if (!route) return []

//   if (route.path === '/') {
//     return route
//   }
//   // get each parent path
//   const parts = route.path.slice(1).split('/')
//   let explodedSegments = []
//   for (let i = 0; i < parts.length; i++) {
//     explodedSegments[i] = '/' + parts.slice(0, i + 1).join('/')
//   }

//   explodedSegments.unshift('/')

//   // match each path segment to a route
//   return R.map(
//     x => R.pick(['id', 'path'], R.propOr({}, 'route', matchFirst(routes, x))),
//     explodedSegments,
//   )
// }

export const getSidebarRouteDefinitions = R.always([
  { routeId: routeIds.DASHBOARD, label: "Dashboard", icon: "home" },
  {
    routeId: routeIds.SCOPE,
    label: "Scope",
    icon: "light-bulb",
    subRoutes: [
      { routeId: "", label: "Initiatives" },
      { routeId: "", label: "Epics" },
      { routeId: routeIds.STORIES, label: "Stories" },
      { routeId: "", label: "Defects" },
    ],
  },
  { label: "Releases", icon: "plane", routeId: "" },
  { label: "Testing", icon: "checkbox", routeId: "" },
  { label: "Environments", icon: "server", routeId: "" },
  { label: "Deployment", icon: "deploy", routeId: "" },
  { label: "Calendar", icon: "calendar", routeId: routeIds.CALENDAR },
  { label: "Schedule", icon: "schedule", routeId: routeIds.SCHEDULE },
  { label: "Automation", icon: "automate", routeId: routeIds.AUTOMATION },
  { label: "Integrations", icon: "plug", routeId: routeIds.INTEGRATION },
]);

const secondaryRouteIds = new Set([
  routeIds.CALENDAR,
  routeIds.SCHEDULE,
  routeIds.AUTOMATION,
  routeIds.INTEGRATION,
]);

export const isSecondaryRoute = (routeId) => secondaryRouteIds.has(routeId);

const isSidebarRouteActive = (activeRouteId, sidebarRouteId) => {
  if (activeRouteId === sidebarRouteId) {
    return true;
  }
  if (activeRouteId === routeIds.STORIES && sidebarRouteId === routeIds.SCOPE) {
    return true;
  }
  switch (activeRouteId) {
    case routeIds.STORY_DETAIL:
      if (
        new Set([routeIds.SCOPE, routeIds.STORIES, routeIds.STORY_DETAIL]).has(
          sidebarRouteId
        )
      ) {
        return true;
      }
  }
};

export const getSidebarRoutes = derive(
  [getRouteId, getSidebarRouteDefinitions],
  (activeRouteId, defs) => {
    // console.log('active', activeRouteId);
    const withActiveStatus = defs.map((def) => {
      const { routeId, subRoutes } = def;
      return R.assoc(
        "active",
        isSidebarRouteActive(activeRouteId, routeId),
        R.assoc(
          "subRoutes",
          (subRoutes || []).map((subRoute) =>
            R.assoc(
              "active",
              isSidebarRouteActive(activeRouteId, subRoute.routeId),
              subRoute
            )
          ),
          def
        )
      );
    });
    const [secondary, primary] = R.partition(
      (d) => isSecondaryRoute(d.routeId),
      withActiveStatus
    );
    return { mainRoutes: primary, otherRoutes: secondary };
  }
);

const getSidebarRouteLabelMap = derive(
  [getSidebarRouteDefinitions],
  (sidebarRoutes) => {
    return sidebarRoutes.reduce((a, m) => {
      a[m.routeId] = m.label;
      if (m.subRoutes) {
        m.subRoutes.forEach((m) => (a[m.routeId] = m.label));
      }
      return a;
    }, {});
  }
);
