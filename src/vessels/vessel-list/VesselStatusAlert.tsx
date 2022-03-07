import React from "react";
import { theme } from "styles/theme";
import { component, createSub } from "framework-x";
import { Flex, Text, Button } from "../../components/standalone";
import { getSelectedVesselDetail, getVesselStatuses } from "../selectors";
import * as R from "ramda";
import { getSelectedVesselId } from "../selectors";
import { routeIds } from "routes/events";
import { getRouteId } from "routes/selectors";
import { getCrewStatuses } from "crew/selectors";

export default component(
  "VesselStatusAlert",
  createSub({
    vesselStatuses: getVesselStatuses,
    crewStatuses: getCrewStatuses,
    vessel: getSelectedVesselDetail,
    vesselId: getSelectedVesselId,
    routeId: getRouteId,
  }),
  ({ vesselStatuses, vesselId, routeId, vessel, crewStatuses }) => {
    if (!vesselStatuses) {
      return null;
    }
    let overdueCount = 0;
    let upcomingCount = 0;
    if (routeId == routeIds.VESSEL_LIST) {
      overdueCount =
        vesselStatuses == {} ? 0 : vesselStatuses.totalOverdueCount;
      upcomingCount =
        vesselStatuses == {} ? 0 : vesselStatuses.totalUpcomingCount;
    } else if (routeId == routeIds.VESSEL_DETAIL) {
      overdueCount =
        vesselStatuses == {} || !R.has(vesselId)(vesselStatuses.vessels)
          ? 0
          : vesselStatuses.vessels[vesselId].overdueCount;
      upcomingCount =
        vesselStatuses == {} || !R.has(vesselId)(vesselStatuses.vessels)
          ? 0
          : vesselStatuses.vessels[vesselId].upcomingCount;
      //Include crew overdue and upcomming count
      const { crew } = vessel;
      R.forEach((item) => {
        overdueCount += R.length(
          R.pathOr([], ["crewMembers", item.id, "overdue"], crewStatuses)
        );
        upcomingCount += R.length(
          R.pathOr([], ["crewMembers", item.id, "upcoming"], crewStatuses)
        );
      }, crew);
    }
    if (overdueCount == 0 && upcomingCount == 0) return null;
    return (
      <Flex alignItems="center">
        <Text fontSize="13px" color={theme.colors.gray[500]}>
          Alerts:{" "}
        </Text>
        {overdueCount > 0 && (
          <Button
            size="sm"
            fontSize="13px"
            color={theme.colors.red[500]}
            backgroundColor={`${theme.colors.red[100]} !important`}
            boxShadow={"none !important"}
            leftIcon={"warning"}
            cursor={"default"}
            marginLeft={3}
            p={5}
          >
            {overdueCount} Overdue
          </Button>
        )}
        {upcomingCount > 0 && (
          <Button
            size="sm"
            fontSize="13px"
            color={theme.colors.orange[500]}
            backgroundColor={`${theme.colors.orange[100]} !important`}
            boxShadow={"none !important"}
            leftIcon={"time"}
            cursor={"default"}
            marginLeft={3}
            p={5}
          >
            {upcomingCount} Upcoming
          </Button>
        )}
      </Flex>
    );
  }
);
