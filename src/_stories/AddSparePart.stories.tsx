/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Navbar } from 'components';
import { Infobar } from 'components';
import { SparePartForm } from '../vessels/vessel-detail/forms/SparePartForm';

export default {
  title: 'Pages/AddForms/AddSparePart',
  component: SparePartForm,
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
    <SparePartForm />
  </div>
);
