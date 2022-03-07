import React from "react";
import { theme } from "styles/theme";
import { component, createSub } from "framework-x";
import { Flex, Text, Button } from "../../components/standalone";
import { getCrewStatuses, getSelectedCrewId } from "../selectors";
import * as R from "ramda";
import { getSelectedVesselId } from "../selectors";
import { routeIds } from "routes/events";
import { getRouteId } from "routes/selectors";

export default component(
  "CrewStatusAlert",
  createSub({
    crewStatuses: getCrewStatuses,
    crewId: getSelectedCrewId,
    routeId: getRouteId,
  }),
  ({ crewStatuses, routeId, crewId }) => {
    if (!crewStatuses) {
      return null;
    }
    let overdueCount = 0;
    let upcomingCount = 0;
    if (routeId == routeIds.CREW_LIST) {
      overdueCount = crewStatuses == {} ? 0 : crewStatuses.totalOverdueCount;
      upcomingCount = crewStatuses == {} ? 0 : crewStatuses.totalUpcomingCount;
    } else if (routeId == routeIds.CREW_DETAIL) {
      overdueCount = R.pathOr(
        0,
        ["crewMembers", crewId, "overdueCount"],
        crewStatuses
      );
      upcomingCount = R.pathOr(
        0,
        ["crewMembers", crewId, "upcomingCount"],
        crewStatuses
      );
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
