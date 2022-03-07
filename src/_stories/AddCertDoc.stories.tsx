/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { CertDocForm } from '../vessels/vessel-detail/forms/CertDocForm';
import { Infobar, Navbar } from 'components';

export default {
  title: 'Pages/AddForms/AddCertDoc',
  component: CertDocForm,
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
    <CertDocForm />
  </div>
);
