/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Navbar } from 'components';
import { Infobar } from 'components';
import { SafetyEquipmentForm } from '../vessels/vessel-detail/forms/SafetyEquipmentForm';

export default {
  title: 'Pages/AddForms/AddSafetyEquipment',
  component: SafetyEquipmentForm,
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
    <SafetyEquipmentForm />
  </div>
);
