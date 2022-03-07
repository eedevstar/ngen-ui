import React from 'react';
import { Link as ChakraLink } from '@chakra-ui/core';
import { routeEvent, RouteIds } from '../events';
import { component } from 'framework-x';

export const Link = component(
  'Link',
  ({
    css,
    routeId,
    params,
    children,
    dispatch,
  }: {
    dispatch?: any;
    css?: any;
    routeId: RouteIds;
    params?: { [k: string]: any };
    children: React.ReactNode;
  }) => {
    return (
      <ChakraLink
        css={css}
        onClick={() => dispatch(routeEvent.NAV_TO, [routeId, params])}
      >
        {children}
      </ChakraLink>
    );
  }
);
