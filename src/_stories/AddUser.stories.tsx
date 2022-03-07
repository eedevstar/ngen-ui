/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import UserAdd from '../users/user-add/UserAdd';
import { Navbar } from 'components';
import { Infobar } from 'components';

export default {
  title: 'Pages/AddForms/AddUser',
  component: UserAdd,
};

export const Default = () => (
  <div
    css={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Navbar />
    <Infobar
      breadcrumbs={[
        { name: 'Customer', route: '/home' },
        { name: 'Vessels', route: '/vessels' },
      ]}
    />
    <UserAdd />
  </div>
);
