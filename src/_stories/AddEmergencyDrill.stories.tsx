/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { EmergencyDrillForm } from '../vessels/vessel-detail/forms/EmergencyDrillForm';
import { Navbar } from 'components';
import { Infobar } from 'components';

export default {
  title: 'Pages/AddForms/AddEmergencyDrill',
  component: EmergencyDrillForm,
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
    <EmergencyDrillForm />
  </div>
);
