/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Switch } from 'components';

export default {
  title: 'Components/Switch',
  component: Switch,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Switch label={'Switch me'} />
  </div>
);

export const WithDescription = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Switch
      label={'Switch me'}
      description={'This is a description for this switch.'}
    />
  </div>
);
