/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import { Text } from "components/standalone";
import { theme } from "styles/theme";
import { component, createSub } from "framework-x";
import { routeEvent, routeIds } from "../routes/events";

const Wrapper = styled.div({
  display: "flex",
});

export const ContextSwitcher = component(
  "ContextSwitcher",
  createSub({}),
  ({ dispatch, activeContext, disabled }) => {
    const isVesselRoute = activeContext === "vessel";
    const isCrewRoute = activeContext === "crew";

    return (
      <Wrapper>
        <div
          css={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            cursor: disabled ? "default" : "pointer",
            border: "1px solid rgba(0,0,0,0)",
          }}
          onClick={() =>
            disabled
              ? null
              : dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_LIST])
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="143.763"
            height="36"
            viewBox="0 0 143.763 36"
          >
            <path
              d="M0,3A3,3,0,0,1,3,0H110.757a3,3,0,0,1,2.121.879l30,30A3,3,0,0,1,140.757,36H3a3,3,0,0,1-3-3Z"
              fill={isVesselRoute ? "#3cc3e3" : "#1d3c62"}
            />
          </svg>
          <Text
            css={{
              fontSize: theme.fontSizes.md,
              fontFamily: theme.fonts.heading,
              fontWeight: theme.fontWeights.bold,
              position: "absolute",
              left: 16,
              ...theme.noUserSelect,
            }}
          >
            Vessels
          </Text>
          <Text />
        </div>
        <div
          css={{
            position: "relative",
            left: -16,
            display: "flex",
            alignItems: "center",
            cursor: disabled ? "default" : "pointer",
            border: "1px solid rgba(0,0,0,0)",
            overflow: "visible",
          }}
          onClick={() =>
            disabled ? null : dispatch(routeEvent.NAV_TO, [routeIds.CREW_LIST])
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="145.812"
            height="38"
            viewBox="0 0 145.812 38"
          >
            <path
              d="M0,3A3,3,0,0,1,3,0H110.757a3,3,0,0,1,2.121.879l30,30A3,3,0,0,1,140.757,36H3a3,3,0,0,1-3-3Z"
              transform="translate(144.812 37) rotate(180)"
              fill={isCrewRoute ? "#3cc3e3" : "#1d3c62"}
              stroke="#54c7f2"
              strokeMiterlimit="10"
              strokeWidth="0"
            />
          </svg>
          <Text
            css={{
              fontSize: theme.fontSizes.md,
              fontFamily: theme.fonts.heading,
              fontWeight: theme.fontWeights.bold,
              position: "absolute",
              right: 16,
              ...theme.noUserSelect,
            }}
          >
            Crew
          </Text>
        </div>
      </Wrapper>
    );
  }
);
