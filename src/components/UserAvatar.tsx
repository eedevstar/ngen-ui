/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import styled from '@emotion/styled';
import { NaviGateTheme } from 'styles/theme';

const ProfilePicture = styled.div(
  ({ picture, theme }: { picture: string; theme: NaviGateTheme }) => ({
    borderRadius: '100%',
    width: 28,
    height: 28,
    backgroundColor: theme.colors.cyan[500],
    backgroundImage: `url("${picture}")`,
    backgroundSize: 'cover',
    marginRight: 8,
  })
);

const Name = styled.span(({ theme }: { theme: NaviGateTheme }) => ({
  color: theme.colors.white,
  fontSize: theme.fontSizes.sm,
}));

export const UserAvatar = ({ name, picture }) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <ProfilePicture picture={picture} />
    <Name>{name}</Name>
  </div>
);
