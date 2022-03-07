import { routeIds, vesselSubListRouteIds } from "./events";
import * as R from "ramda";
import { fx } from "../store";
import { UserRoles } from "../util";
export const initialDataFetched = R.path(["initialDataFetched"]);

/** Default on enter just reuses the route id and params as the event / payload */
const onEnter = (_, locationAndMatch) => {
  return [
    fx.dispatch(locationAndMatch.match.route.id, locationAndMatch.match.params),
  ];
};

export const routes: Route[] = [
  {
    id: routeIds.ROOT,
    path: "/",
  },
  {
    id: routeIds.LOGIN,
    path: "/login",
  },
  {
    id: routeIds.SETTINGS,
    path: "/settings",
    role: [UserRoles.ADMIN],
    onEnter,
  },
  {
    id: routeIds.SETTINGS_EDIT,
    path: "/settings/edit",
    role: [UserRoles.ADMIN],
    onEnter,
  },
  {
    id: routeIds.CUSTOMER_LIST,
    path: "/customer",
    role: [UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CUSTOMER_ADD,
    path: "/customer/add",
    role: [UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CUSTOMER_DETAIL,
    path: "/customer/:id",
    role: [UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CUSTOMER_EDIT,
    path: "/customer/:id/edit",
    role: [UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_LIST,
    path: "/crew",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_ADD,
    path: "/crew/add",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_EDIT,
    path: "/crew/:id/edit",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_DETAIL,
    path: "/crew/:id",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_CERTS,
    path: "/crew/:id/certs",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_CERTS_ADD,
    path: "/crew/:id/certs/add",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_CERTS_DETAIL,
    path: "/crew/:id/certs/:childId",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.CREW_CERTS_EDIT,
    path: "/crew/:id/certs/:childId/edit",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.USER_LIST,
    path: "/user",
    role: [UserRoles.ADMIN, UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.USER_ADD,
    path: "/user/add",
    role: [UserRoles.ADMIN, UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.USER_DETAIL,
    path: "/user/:id",
    role: [UserRoles.ADMIN, UserRoles.ROOT, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.VESSEL_LIST,
    path: "/vessel",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.VESSEL_ADD,
    path: "/vessel/add",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.VESSEL_EDIT,
    path: "/vessel/:id/edit",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },
  {
    id: routeIds.VESSEL_DETAIL,
    path: "/vessel/:id",
    role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
    onEnter,
  },

  /** Auto wire vessel sub routes to save some time / keep it more consistent **/
  // vessel sub lists
  ...R.map(
    ([k, v]) => ({
      id: v,
      path: `/vessel/:id/${R.tail(k.split("_")).join("/").toLowerCase()}`,
      role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
      onEnter,
    }),
    R.toPairs(vesselSubListRouteIds)
  ),

  // vessel add
  ...R.map(
    ([k, v]) => ({
      id: `${v}/add`,
      path: `/vessel/:id/${R.tail(k.split("_")).join("/").toLowerCase()}/add`,
      role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
      onEnter,
    }),
    R.toPairs(vesselSubListRouteIds)
  ),

  // vessel detail
  ...R.map(
    ([k, v]) => ({
      id: `${v}/detail`,
      path: `/vessel/:id/${R.tail(k.split("_"))
        .join("/")
        .toLowerCase()}/:childId`,
      role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
      onEnter,
    }),
    R.toPairs(vesselSubListRouteIds)
  ),

  // vessel edit
  ...R.map(
    ([k, v]) => ({
      id: `${v}/edit`,
      path: `/vessel/:id/${R.tail(k.split("_"))
        .join("/")
        .toLowerCase()}/:childId/edit`,
      role: [UserRoles.ADMIN, UserRoles.CUSTOMER_ADMIN],
      onEnter,
    }),
    R.toPairs(vesselSubListRouteIds)
  ),
];

export type Route = Readonly<
  {
    id: string;
    path: string;
    onEnter?: any;
    onExit?: any;
    role?: any;
  } & { [k: string]: any }
>;
