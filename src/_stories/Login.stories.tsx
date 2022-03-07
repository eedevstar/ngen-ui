/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Login } from 'auth/Login';

export default {
  title: 'Pages/Login',
  component: Login,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Login />
  </div>
);
