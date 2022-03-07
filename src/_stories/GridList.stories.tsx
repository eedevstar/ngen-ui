/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Grid, GridVesselItem, GridUserItem, GridCrewItem } from 'components';

export default {
  title: 'Components/Grid',
  component: Grid,
};

export const Default = () => (
  <div
    css={{
      height: '100vh',
      width: 900,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Grid entityName={'Entity name'} />
  </div>
);

export const withVessels = () => (
  <div
    css={{
      height: '100vh',
      width: 900,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Grid
      entityName={'Licensed Vessels'}
      EntityComponent={GridVesselItem}
      toolbarActions={['add', 'remove']}
      entities={[
        {
          name: 'The Almighty, Unstoppable Ship',
          id: 1234,
          image: require('../_stories/assets/ship.jpg'),
        },
        { name: 'Ship 2', id: 1234 },
        { name: 'Ship 3', id: 1234 },
        { name: 'Ship 4', id: 1234 },
        { name: 'Ship 5', id: 1234 },
      ]}
    />
  </div>
);

export const withCrew = () => (
  <div
    css={{
      height: '100vh',
      width: 900,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Grid
      entityName={'Crew'}
      EntityComponent={GridCrewItem}
      toolbarActions={['add', 'remove']}
      entities={[
        {
          name: 'Mark Cormier',
          id: 1234,
          image: require('../_stories/assets/user.jpg'),
        },
        { name: 'Haylie McGregor', id: 1234 },
        { name: 'Joan Burgess', id: 1234 },
        { name: 'Martin Pratt', id: 1234 },
        { name: 'Andrea McCann', id: 1234 },
      ]}
    />
  </div>
);

export const withUsers = () => (
  <div
    css={{
      height: '100vh',
      width: 900,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Grid
      entityName={'System Users'}
      EntityComponent={GridUserItem}
      toolbarActions={['add', 'remove', 'edit', 'reset-password']}
      entities={[
        {
          name: 'Mark Cormier',
          id: 1234,
          image: require('../_stories/assets/user.jpg'),
          isReadOnly: false,
        },
        { name: 'Larry Lancaster', id: 1234, isReadOnly: false },
        { name: 'Davion Sanchez', id: 1234, isReadOnly: true },
        { name: "Marisa O'Connell", id: 1234, isReadOnly: true },
        { name: 'Andre Hackett', id: 1234, isReadOnly: true },
      ]}
    />
  </div>
);
