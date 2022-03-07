/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Icon, Textarea } from 'components';

export default {
  title: 'Components/Textarea',
  component: Textarea,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Textarea label={'Field name'} placeholder={'Default input'} />
  </div>
);

export const SecondaryLabel = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Textarea
      label={'Field name'}
      secondaryLabel={'Required'}
      placeholder={'Input with secondary label'}
    />
  </div>
);

export const withDescription = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Textarea
      label={'Field name'}
      description={'This is a description for this input.'}
      placeholder={'Input with description'}
    />
  </div>
);
