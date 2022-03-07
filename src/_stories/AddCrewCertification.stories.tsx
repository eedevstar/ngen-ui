/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Navbar } from 'components';
import { Infobar } from 'components';
import { CrewCertificationForm } from '../crew/crew-detail/forms/CrewCertificationForm';

export default {
  title: 'Pages/AddForms/AddCrewCertification',
  component: CrewCertificationForm,
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
    <CrewCertificationForm />
  </div>
);
