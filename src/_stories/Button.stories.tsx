/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Button } from 'components';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Button>Default button</Button>
  </div>
);

export const Disabled = () => {
  return (
    <div css={{ height: '100vh', width: '100vw' }}>
      <Button color={'gray.400'}>Light button</Button>
    </div>
  );
};

export const Light = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Button bg={'cyan.400'} _hover={{ backgroundColor: 'cyan.600' }}>
      Light button
    </Button>
  </div>
);

export const WithLeftIcon = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Button leftIcon={'email'}>Button with left icon</Button>
  </div>
);

export const WithRightIcon = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Button rightIcon={'arrow-forward'}>Button with right icon</Button>
  </div>
);
