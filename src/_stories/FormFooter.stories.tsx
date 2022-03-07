/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Button } from 'components';
import { FormFooter } from 'components';

export default {
  title: 'Components/FormFooter',
  component: FormFooter,
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
    <FormFooter leftButtonLabel={'Button'} rightButtonLabel={'Button'} />
  </div>
);
