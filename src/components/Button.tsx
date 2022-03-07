/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { theme } from 'styles/theme';
import { Button as ChakraButton } from '@chakra-ui/core';

export const Button: typeof ChakraButton = ({
  width,
  light,
  children,
  variantColor,
  labelColor,
  disabled,
  ...props
}: {
  labelColor?: string;
  width?: number;
  children: any;
  light?: boolean;
  variantColor?: string;
  disabled?: boolean;
}) => {
  return (
    <ChakraButton
      isDisabled={disabled}
      fontFamily="heading"
      fontSize="sm"
      fontWeight="semibold"
      color={variantColor ? `${variantColor}.400` : theme.colors.white}
      variantColor={variantColor}
      width={width}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
