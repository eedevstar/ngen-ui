/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import VesselDetail from '../vessels/vessel-detail/VesselDetail';
import { Navbar } from 'components';
import { Infobar } from 'components';

export default {
  title: 'Pages/VesselDetail',
  component: VesselDetail,
};

const tasks = {
  headers: ['Category', 'Name', 'Issued', 'Expires'],
  content: [
    ['Certificates', 'International Tonnage', '01/31/2019', '02/01/2020'],
    ['Certificates', 'Certificate of Insurance', '06/30/2019', '07/01/2020'],
    ['Certificates', 'Certificate of Insurance', '06/30/2019', '07/01/2020'],
    ['Certificates', 'Certificate of Insurance', '06/30/2019', '07/01/2020'],
  ],
};

export const Default = () => (
  <div
    css={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }}
  >
    <Navbar />
    <Infobar
      breadcrumbs={[
        { name: 'Customer', route: '/home' },
        { name: 'Vessels', route: '/vessels' },
        { name: 'Vessel #2', route: '/vessel' },
      ]}
    />
    <VesselDetail
      vessel={{ imageSrc: require('./assets/ship.jpg') }}
      tasks={tasks}
    />
  </div>
);
