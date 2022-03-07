/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Box } from 'components/standalone';

export const FormWrapper = ({ children }: { children?: any }) => {
  return <Box>{children}</Box>;
};
