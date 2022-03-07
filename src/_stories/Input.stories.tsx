/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Icon, Input } from 'components';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Input label={'Field name'} placeholder={'Default input'} />
  </div>
);

export const SecondaryLabel = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Input
      label={'Field name'}
      secondaryLabel={'Required'}
      placeholder={'Input with secondary label'}
    />
  </div>
);

export const WithLeftElement = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Input
      label={'Field name'}
      leftElement={<Icon name={'phone'} />}
      placeholder={'Input with left element'}
    />
  </div>
);

export const WithRightElement = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Input
      label={'Field name'}
      rightElement={<Icon name={'check'} />}
      placeholder={'Input with right element'}
    />
  </div>
);

export const withDescription = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Input
      label={'Field name'}
      description={'This is a description for this input.'}
      placeholder={'Input with description'}
    />
  </div>
);
