/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import {
  CSSReset,
  theme,
  ThemeProvider as ChakraThemeProvider,
} from '@chakra-ui/core'
import { useTheme as emotionUseTheme } from 'emotion-theming'
import { customIcons } from './icons'

const colors = {
  white: '#fff',
  black: '#2A2A2A',
  gray: {
    50: '#F4F6F9',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  cyan: {
    50: '#EDFDFD',
    100: '#C4F1F9',
    200: '#9DECF9',
    300: '#76E4F7',
    400: '#3CC3E3',
    500: '#00B5D8',
    600: '#00A3C4',
    700: '#0987A0',
    800: '#086F83',
    900: '#065666',
  },
  blue: {
    50: '#ebf8ff',
    100: '#ceedff',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#3182ce',
    600: '#1D3C62',
    700: '#061F3D',
    800: '#153e75',
    900: '#273D58',
  },
}

const fonts = {
  heading: '\'Karla\', \'Roboto\', \'Helvetica Neue\', \'Arial\', sans-serif',
  body: '\'Inter\', \'Roboto\', \'Helvetica Neue\', \'Arial\', sans-serif',
  mono:
    'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
}

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': '24px',
  // '3xl': '28px',
  // '4xl': '32px',
  // '5xl': '36px',
  // '6xl': '40px',
}

const fontWeights = {
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
}

const noUserSelect = {
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
}

const customTheme = {
  ...theme,
  fontSizes: { ...fontSizes },
  colors: {
    ...theme.colors,
    ...colors,
  },
  icons: {
    ...theme.icons,
    ...customIcons,
  },
  fonts: {
    ...theme.fonts,
    ...fonts,
  },
  fontWeights: {
    ...theme.fontWeights,
    ...fontWeights,
  },
  noUserSelect,
}

export type NaviGateTheme = typeof customTheme;
export const useTheme = () => emotionUseTheme<NaviGateTheme>()
// FIXME. Selector pattern, may prefer over hooks. Not clear if theme will be stateful on the client
export const getTheme = () => customTheme
export { customTheme as theme }

// refactored ThemeProvider to use in both app and Storybook
export const ThemeProvider = ({ children }) => (
  <ChakraThemeProvider theme={customTheme}>
    <CSSReset/>
    {children}
  </ChakraThemeProvider>
)
