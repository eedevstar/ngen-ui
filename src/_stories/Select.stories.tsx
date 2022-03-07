/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Icon, Select } from 'components';

export default {
  title: 'Components/Select',
  component: Select,
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Select
      label={'Field name'}
      placeholder={'Select an option...'}
      options={[
        { value: 'option1', label: 'First Option' },
        { value: 'option2', label: 'Second Option' },
        { value: 'option3', label: 'Third Option' },
      ]}
    />
  </div>
);

export const SecondaryLabel = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Select
      label={'Field name'}
      secondaryLabel={'Required'}
      placeholder={'Select an option...'}
      options={[
        { value: 'option1', label: 'First Option' },
        { value: 'option2', label: 'Second Option' },
        { value: 'option3', label: 'Third Option' },
      ]}
    />
  </div>
);

export const withDescription = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Select
      label={'Field name'}
      description={'This is a description for this input.'}
      placeholder={'Select an option...'}
      options={[
        { value: 'option1', label: 'First Option' },
        { value: 'option2', label: 'Second Option' },
        { value: 'option3', label: 'Third Option' },
      ]}
    />
  </div>
);
