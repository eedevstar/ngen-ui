/** @jsx jsx */
import React, { useEffect } from "react";
import { fx, regEventFx } from "./store";
import { component, createSub } from "framework-x";
import { RouteNotFound, startRouter } from "./routes";
import { getRoute } from "./routes/selectors";
import { routeEvent, RouteIds, routeIds } from "./routes/events";
import loadable from "@loadable/component";
import { jsx } from "@emotion/core";
import { ChakraGrid, Infobar, Navbar, Box, Spinner } from "components";
import * as R from "ramda";
import { theme, useToast } from "@chakra-ui/core";
import { useToastFx } from "./fx";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import { Route } from "routes/routes";
import { getCurrentUserId, getUser } from "users/selectors";
import { User } from "users/db";
import { isAdmin, isRoot } from "./util";
import { evt } from "app/events";

const ToastContainer = () => {
  const toast = useToast();
  useToastFx((msg) => toast(msg));
  return null;
};
const checkPermission = (route, user, dispatch) => {
  if (route.id == routeIds.ROOT) {
    return [
      isAdmin(user)
        ? dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_LIST])
        : dispatch(routeEvent.NAV_TO, [routeIds.CUSTOMER_LIST]),
    ];
  }
  //Check User Permission for the current route
  const roles = R.pathOr(null, ["role"], route);
  if (roles == null || R.indexOf(user.role, roles) > -1) {
    //Allowed
    return true;
  } else {
    dispatch(routeEvent.NAV_TO, [routeIds.ROOT]);
    return false;
  }
};

const App = component(
  "App",
  createSub({
    users: getUser,
    route: getRoute,
  }),
  ({ users, route, dispatch }: { users: any; route: Route; dispatch: any }) => {
    const currentUserId = getCurrentUserId();
    const currentUser = R.pathOr(null, [currentUserId], users);

    const routeId = route.id;
    //Loading Screen
    if (routeId !== routeIds.LOGIN) {
      if (!currentUser) {
        dispatch(evt.INITIAL_DATA_LOAD);
        return (
          <React.Fragment>
            <ToastContainer />
            <ChakraGrid templateRows={"60px 1fr"} h={"100vh"}>
              <Navbar />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                backgroundColor={theme.colors.gray[50]}
              >
                <Spinner size="lg" />
              </Box>
            </ChakraGrid>
          </React.Fragment>
        );
      } else {
        //check user permission
        checkPermission(route, currentUser, dispatch);
      }
    }

    return (
      <React.Fragment>
        <ToastContainer />
        <ChakraGrid
          templateRows={routeId !== routeIds.LOGIN ? "60px 60px 1fr" : "1fr"}
          h={"100vh"}
        >
          {routeId !== routeIds.LOGIN && <Navbar currentUser={currentUser} />}
          {routeId !== routeIds.LOGIN && (
            <div
              css={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Infobar />
            </div>
          )}
          <ChakraGrid
            overflow={"auto"}
            templateColumns={
              routeId !== routeIds.LOGIN
                ? [
                    "24px 1fr 24px",
                    "24px 1fr 24px",
                    "24px 1fr 24px",
                    "1fr 900px 1fr",
                  ]
                : "1fr"
            }
            css={{
              "& > :first-child": {
                gridColumnStart: routeId !== routeIds.LOGIN ? 2 : "unset",
                gridColumnEnd: routeId !== routeIds.LOGIN ? 2 : "unset",
              },
            }}
          >
            {(() => {
              switch (routeId) {
                // case routeIds.ROOT:

                case routeIds.LOGIN:
                  return React.createElement(
                    loadable(
                      () =>
                        import(/* webpackChunkName: "login" */ "./auth/Login")
                    )
                  );
                case routeIds.CUSTOMER_LIST:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "customer list" */ "customers/pages/CustomerList"
                        )
                    )
                  );
                case routeIds.CUSTOMER_ADD:
                case routeIds.CUSTOMER_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "customer list" */ "customers/pages/CustomerEdit"
                        )
                    )
                  );
                case routeIds.SETTINGS:
                case routeIds.SETTINGS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "settings" */ "users/settings/Settings"
                        )
                    )
                  );
                case routeIds.CREW_ADD:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "crew-add" */ "crew/crew-add/CrewAddEdit"
                        )
                    )
                  );
                case routeIds.CREW_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "crew-add" */ "crew/crew-add/CrewAddEdit"
                        )
                    )
                  );
                case routeIds.CREW_DETAIL:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "crew-detail" */ "./crew/crew-detail/CrewDetail"
                        )
                    )
                  );

                case routeIds.CREW_LIST:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "crew-list" */ "crew/crew-list/CrewList"
                        )
                    )
                  );

                case routeIds.CREW_CERTS_DETAIL:
                case routeIds.CREW_CERTS_ADD:
                case routeIds.CREW_CERTS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "crew/crew-detail/forms/CertDocForm"
                        )
                    )
                  );
                case routeIds.USER_ADD:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "user-add" */ "users/user-add/UserAdd"
                        )
                    )
                  );

                case routeIds.USER_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "user-add" */ "users/user-add/UserAdd"
                        )
                    )
                  );

                case routeIds.USER_DETAIL:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "user-add" */ "users/user-add/UserAdd"
                        )
                    )
                  );

                case routeIds.USER_LIST:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "user-list" */ "users/user-list/UserList"
                        )
                    )
                  );

                case routeIds.VESSEL_LIST:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-list" */ "vessels/vessel-list/VesselList"
                        )
                    )
                  );

                case routeIds.VESSEL_ADD:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-add" */ "vessels/vessel-add-edit/VesselAddEdit"
                        )
                    )
                  );

                case routeIds.VESSEL_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-add" */ "vessels/vessel-add-edit/VesselAddEdit"
                        )
                    )
                  );

                case routeIds.VESSEL_DETAIL:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/VesselDetail"
                        )
                    )
                  );

                case routeIds.VESSEL_CERTS:
                case routeIds.VESSEL_AUDITS:
                case routeIds.VESSEL_SURVEYS:
                case routeIds.VESSEL_REVIEWS:
                case routeIds.VESSEL_DRILLS:
                case routeIds.VESSEL_TRAINING:
                case routeIds.VESSEL_EQUIP:
                case routeIds.VESSEL_SAFETY:
                case routeIds.VESSEL_MAINT:
                case routeIds.VESSEL_PARTS:
                case routeIds.VESSEL_ACTIONS:
                case routeIds.VESSEL_REPAIRS:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/GenericVesselSubList"
                        )
                    )
                  );

                case routeIds.VESSEL_CERTS_DETAIL:
                case routeIds.VESSEL_CERTS_ADD:
                case routeIds.VESSEL_CERTS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/CertDocForm"
                        )
                    )
                  );
                case routeIds.VESSEL_AUDITS_DETAIL:
                case routeIds.VESSEL_AUDITS_ADD:
                case routeIds.VESSEL_AUDITS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/AuditForm"
                        )
                    )
                  );
                case routeIds.VESSEL_SURVEYS_DETAIL:
                case routeIds.VESSEL_SURVEYS_ADD:
                case routeIds.VESSEL_SURVEYS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/SurveyForm"
                        )
                    )
                  );
                case routeIds.VESSEL_REVIEWS_DETAIL:
                case routeIds.VESSEL_REVIEWS_ADD:
                case routeIds.VESSEL_REVIEWS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/ReviewForm"
                        )
                    )
                  );
                case routeIds.VESSEL_DRILLS_DETAIL:
                case routeIds.VESSEL_DRILLS_ADD:
                case routeIds.VESSEL_DRILLS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/EmergencyDrillForm"
                        )
                    )
                  );
                case routeIds.VESSEL_TRAINING_DETAIL:
                case routeIds.VESSEL_TRAINING_ADD:
                case routeIds.VESSEL_TRAINING_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/TrainingForm"
                        )
                    )
                  );
                case routeIds.VESSEL_EQUIP_DETAIL:
                case routeIds.VESSEL_EQUIP_ADD:
                case routeIds.VESSEL_EQUIP_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/SafetyEquipmentForm"
                        )
                    )
                  );
                case routeIds.VESSEL_SAFETY_DETAIL:
                case routeIds.VESSEL_SAFETY_ADD:
                case routeIds.VESSEL_SAFETY_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/HealthSafetyItemForm"
                        )
                    )
                  );
                case routeIds.VESSEL_MAINT_DETAIL:
                case routeIds.VESSEL_MAINT_ADD:
                case routeIds.VESSEL_MAINT_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/MaintenanceItemForm"
                        )
                    )
                  );
                case routeIds.VESSEL_PARTS_DETAIL:
                case routeIds.VESSEL_PARTS_ADD:
                case routeIds.VESSEL_PARTS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/SparePartForm"
                        )
                    )
                  );
                case routeIds.VESSEL_ACTIONS_DETAIL:
                case routeIds.VESSEL_ACTIONS_ADD:
                case routeIds.VESSEL_ACTIONS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/CorrectiveActionForm"
                        )
                    )
                  );
                case routeIds.VESSEL_REPAIRS_DETAIL:
                case routeIds.VESSEL_REPAIRS_ADD:
                case routeIds.VESSEL_REPAIRS_EDIT:
                  return React.createElement(
                    loadable(
                      () =>
                        import(
                          /* webpackChunkName: "vessel-detail" */ "vessels/vessel-detail/forms/RepairRequestForm"
                        )
                    )
                  );
                case routeIds.NOT_FOUND:
                  return <RouteNotFound />;
                default:
                  console.log(
                    "could not find a matching component for route",
                    routeId
                  );
                  return <RouteNotFound />;
              }
            })()}
          </ChakraGrid>
        </ChakraGrid>
      </React.Fragment>
    );
  }
);

export default App;
