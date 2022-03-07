/** @jsx jsx */
import {jsx} from '@emotion/core';
import React from 'react';

const user = {
  name: 'John Doe',
  picture: require('./user-profile-picture.jpg'),
};

export const fakeStore = {
  user,
};
