/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Infobar, Navbar } from 'components';
import { CorrectiveActionForm } from '../vessels/vessel-detail/forms/CorrectiveActionForm';

export default {
  title: 'Pages/AddForms/AddCorrectiveAction',
  component: CorrectiveActionForm,
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
    <CorrectiveActionForm />
  </div>
);
