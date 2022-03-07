/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import CrewAdd from '../crew/crew-add/CrewAddEdit';
import { Navbar } from 'components';
import { Infobar } from 'components';

export default {
  title: 'Pages/AddForms/AddCrew',
  component: CrewAdd,
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
    <CrewAdd />
  </div>
);
