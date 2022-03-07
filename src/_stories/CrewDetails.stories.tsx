/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Navbar } from 'components';
import { Infobar } from 'components';
import CrewDetail from 'crew/crew-detail/CrewDetail';

export default {
  title: 'Pages/CrewDetails',
  component: CrewDetail,
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
        {
          name: 'Vessel #2',
          route: '/vessel',
        },
      ]}
    />
    <CrewDetail
      crew={{
        name: 'Gaspar Antunes',
        title: 'Naval Engineer',
        imageSrc: require('./assets/user.jpg'),
        entitlements: [
          { name: 'Certificates & Documents' },
          {
            name: 'Local Limits',
            checked: true,
          },
          { name: 'Restricted Limits', checked: true },
          { name: 'Off shore' },
        ],
        medical: [
          { label: 'Certificate Number', value: 'AK619041', icon: 'document' },
          {
            label: 'Issued',
            value: '06/12/2018',
            icon: 'documentIssued',
          },
          {
            label: 'Expires',
            value: '06/12/2019',
            icon: 'documentExpires',
            expiring: true,
          },
        ],
        firstAid: [
          { label: 'Certificate Number', value: '45MD312', icon: 'document' },
          {
            label: 'Issued',
            value: '06/12/2017',
            icon: 'documentIssued',
          },
          { label: 'Expires', value: '06/12/2025', icon: 'documentExpires' },
        ],
      }}
      tasks={tasks}
    />
  </div>
);
