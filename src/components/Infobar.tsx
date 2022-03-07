/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { component, createSub } from "framework-x";
import styled from "@emotion/styled";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "components/standalone";
import { NaviGateTheme, theme } from "styles/theme";
import { getBreadcrumbs } from "../routes/breadcrumbs";
import { routeEvent, routeIds } from "../routes/events";
import { getRouteId } from "../routes/selectors";
import VesselStatusAlert from "../vessels/vessel-list/VesselStatusAlert";
import CrewStatusAlert from "crew/crew-list/CrewStatusAlert";
import { getCurrentCustomer } from "customers/selectors";

const Wrapper = styled.div(({ theme }: { theme: NaviGateTheme }) => ({
  width: 900,
}));

export const Infobar = component(
  "InfoBar",
  createSub({ getBreadcrumbs, getCurrentCustomer, getRouteId }),
  ({ breadcrumbs, routeId, currentCustomer, dispatch }) => {
    return (
      <Wrapper
        css={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumb
          css={{
            fontFamily: theme.fonts.heading,
            fontSize: theme.fontSizes.sm,
            alignSelf: "center",
            "& > * > :last-child": { fontWeight: theme.fontWeights.bold },
          }}
          separator="»"
        >
          {currentCustomer && (
            <BreadcrumbItem>
              <div>{currentCustomer.name}</div>
            </BreadcrumbItem>
          )}
          {breadcrumbs.map((breadcrumb, index) => {
            if (index === breadcrumbs.length - 1)
              return (
                <BreadcrumbItem isCurrentPage key={index}>
                  <div>{breadcrumb.label}</div>
                </BreadcrumbItem>
              );
            else
              return (
                <BreadcrumbItem key={index}>
                  <div
                    css={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      dispatch(routeEvent.NAV_TO, [
                        breadcrumb.id,
                        breadcrumb.params,
                      ])
                    }
                  >
                    {breadcrumb.label}
                  </div>
                </BreadcrumbItem>
              );
          })}
        </Breadcrumb>
        {(routeId == routeIds.VESSEL_LIST ||
          routeId == routeIds.VESSEL_DETAIL) && <VesselStatusAlert />}
        {(routeId == routeIds.CREW_LIST || routeId == routeIds.CREW_DETAIL) && (
          <CrewStatusAlert />
        )}
      </Wrapper>
    );
  }
);
