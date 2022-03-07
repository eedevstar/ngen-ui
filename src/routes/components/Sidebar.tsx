/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import styled from '@emotion/styled';
import { Icon, Link, Text } from 'components';
import { getTheme, NaviGateTheme } from 'styles/theme';
import { component, createSub } from 'framework-x';
import { routeEvent } from '../events';
import { getRouteId, getSidebarRoutes } from '../selectors';

const Wrapper = styled.div(({ theme }: { theme: NaviGateTheme }) => ({
  width: 188,
  height: '100%',
  backgroundColor: theme.colors.gray[100],
  paddingTop: 24,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
}));

const CompanyLogo = styled.div(({ companyLogo }: { companyLogo: string }) => ({
  backgroundImage: `url("${companyLogo}")`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: 100,
  width: 140,
}));

const Route = component(
  'Route',
  createSub({ theme: getTheme }),
  ({ dispatch, theme, label, icon, routeId, active, subRoutes }) => {
    return (
      <div
        css={{
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Link onClick={() => dispatch(routeEvent.NAV_TO, [routeId])}>
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              color: active ? theme.colors.cyan[400] : theme.colors.gray[500],
              fontSize: theme.fontSizes.sm,
              fontWeight: active
                ? theme.fontWeights.semibold
                : theme.fontWeights.medium,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Icon color={theme.colors.cyan[400]} name={icon} size={'16px'} />
            <Text css={{ marginLeft: 8 }}>{label}</Text>
          </div>
        </Link>
        <div>
          {active &&
            subRoutes &&
            subRoutes.map((subRoute, index) => (
              <Link
                key={subRoute.routeId || index}
                onClick={() => dispatch(routeEvent.NAV_TO, [subRoute.routeId])}
              >
                <div
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    color: subRoute.active
                      ? theme.colors.gray[900]
                      : theme.colors.gray[500],
                    fontSize: theme.fontSizes.sm,
                    fontWeight: subRoute.active
                      ? theme.fontWeights.semibold
                      : theme.fontWeights.medium,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <div css={{ width: 16, height: 16 }} />
                  <Text css={{ marginLeft: 8 }}>{subRoute.label}</Text>
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }
);

export const Sidebar = component(
  'Sidebar',
  createSub({
    routeId: getRouteId,
    sidebarRoutes: getSidebarRoutes,
    theme: getTheme,
  }),
  ({ routeId, theme, sidebarRoutes, companyLogo }) => {
    const { mainRoutes, otherRoutes } = sidebarRoutes;
    return (
      <Wrapper>
        <CompanyLogo companyLogo={companyLogo} />
        <div
          css={{
            width: '100%',
            alignSelf: 'flex-start',
            borderTop: '1px solid ' + theme.colors.gray[300],
            marginTop: 20,
            marginBottom: 4,
          }}
        >
          {mainRoutes.map((route, index) => (
            <Route
              key={route.routeId || index}
              label={route.label}
              icon={route.icon}
              routeId={route.routeId}
              active={route.active}
              subRoutes={route.subRoutes}
            />
          ))}
        </div>
        <div
          css={{
            width: '100%',
            alignSelf: 'flex-start',
            borderTop: '1px solid ' + theme.colors.gray[300],
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          {otherRoutes.map((route, index) => (
            <Route
              key={route.routeId || index}
              label={route.label}
              icon={route.icon}
              routeId={route.routeId}
              active={route.active}
              subRoutes={route.subRoutes}
            />
          ))}
        </div>
      </Wrapper>
    );
  }
);
