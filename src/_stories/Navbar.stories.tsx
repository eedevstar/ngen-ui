/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Navbar } from 'components';

export default {
  title: 'Components/Navbar',
  component: Navbar,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Navbar />
  </div>
);
