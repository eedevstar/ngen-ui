/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from './index';
import { createSub, component } from 'framework-x';
import { routeEvent } from '../routes/events';
import { getTheme } from 'styles/theme';
import { getBreadcrumbs } from '../routes/selectors';

export const LayoutTemplate = component(
  'LayoutTemplate',
  createSub({ theme: getTheme, breadcrumbs: getBreadcrumbs }),
  ({
    dispatch,
    breadcrumbs,
    theme,
    children,
    direction,
    Sidebar,
    constrainWidth,
  }) => {
    return (
      <div
        css={{
          display: 'flex',
          width: '100%',
          height: '100%',
          paddingLeft: 16,
          paddingRight: Sidebar ? 0 : 16,
        }}
      >
        <div
          css={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            paddingRight: Sidebar ? 16 : 0,
            '& > *': {
              maxWidth: constrainWidth ? 1120 : 'initial',
            },
            alignItems: 'center',
            overflow: 'auto',
          }}
        >
          <div
            css={{
              width: '100%',
              borderBottom: '1px solid ' + theme.colors.gray[300],
              paddingTop: 12,
              paddingBottom: 12,
              flexShrink: 0,
            }}
          >
            <Breadcrumb>
              {breadcrumbs &&
                breadcrumbs.map((route, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <BreadcrumbItem
                      key={route.id}
                      css={{
                        fontSize: theme.fontSizes.sm,
                        color: isLast
                          ? theme.colors.gray[900]
                          : theme.colors.gray[500],
                        fontWeight: isLast
                          ? theme.fontWeights.semibold
                          : theme.fontWeights.normal,
                      }}
                    >
                      {isLast ? (
                        <div>{route.label}</div>
                      ) : (
                        <BreadcrumbLink
                          onClick={() =>
                            dispatch(routeEvent.NAV_TO, [route.id])
                          }
                        >
                          {route.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  );
                })}
            </Breadcrumb>
          </div>
          <div
            css={{
              height: '100%',
              width: '100%',
              // overflowX: 'visible',
              // overflowY: 'auto',
              display: 'flex',
              flexDirection: direction ? direction : 'row',
            }}
          >
            {children}
          </div>
        </div>
        {Sidebar && <Sidebar />}
      </div>
    );
  }
);
