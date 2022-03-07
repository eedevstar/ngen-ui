/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Infobar } from 'components';

export default {
  title: 'Components/Infobar',
  component: Infobar,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Infobar />
  </div>
);
