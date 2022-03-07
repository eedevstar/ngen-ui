/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import { Grid } from "components";
import GridCrewItem from "components/Grid/GridCrewItem";
import { Box } from "@chakra-ui/core";
import { component, createSub } from "framework-x";
import { routeEvent, routeIds } from "../../routes/events";
import { getCrewList } from "../selectors";
import { sortCrew } from "../../util";

const CrewList = component(
  "CrewList",
  createSub({ crew: getCrewList }),
  ({ dispatch, crew, status, setStatus }) => {
    const inactiveCrews = crew.filter((c) => c.active_crew == false);
    if (status == true) {
      crew = crew.filter((c) => c.active_crew == true);
    }
    return (
      <Box pt={5}>
        <Grid
          entityName={"Crew"}
          EntityComponent={GridCrewItem}
          toolbarActions={
            inactiveCrews && inactiveCrews.length > 0
              ? [
                  {
                    type: "filter",
                    status: status,
                    onClick: () => setStatus(!status),
                  },
                  {
                    type: "add",
                    onClick: () =>
                      dispatch(routeEvent.NAV_TO, [routeIds.CREW_ADD]),
                  },
                  // 'remove'
                ]
              : [
                  {
                    type: "add",
                    onClick: () =>
                      dispatch(routeEvent.NAV_TO, [routeIds.CREW_ADD]),
                  },
                ]
          }
          entities={sortCrew(crew)}
        />
      </Box>
    );
  }
);

export default function () {
  const [status, setStatus] = useState(false);

  return <CrewList status={status} setStatus={setStatus} />;
}
