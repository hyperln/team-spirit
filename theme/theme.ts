import { mode } from '@chakra-ui/theme-tools';
import { ColorMode, extendTheme, theme as baseTheme } from '@chakra-ui/react';

export const config = {
  initialColorMode: 'light' as ColorMode,
  useSystemColorMode: false,
};

export const colors = {
  brand: baseTheme.colors.orange[400],
  link: 'red',
  footer: {
    background: '#ecf0f5',
    title: '#515b69',
    linkItem: '#72849c',
    copyright: '#7f8795',
  },
  input: {
    background: '#F6F6F6',
  },
  header: {
    background: '#6930c3',
    title: '#fff',
    linkItem: '#80ffdb',
    activeLinkItem: '#64dfdf',
  },
};

export const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'white')(props),
      bg: mode('white', '#141214')(props),
    },
  }),
};

const components = {
  // Custom components
  Banner: {
    baseStyle: {
      position: 'fixed',
      bottom: 0,
      py: '2',
      px: '6',
      w: 'full',
      backgroundColor: 'black',
      color: 'white',
    },
  },
  Button: {
    baseStyle: {
      color: 'white',
      borderRadius: '70',
      bg: 'brand',
    },
  },
  Input: {
    baseStyle: {
      bg: 'gray.100',
    },
  },
  Header: {
    baseStyle: {
      position: 'fixed',
      zIndex: 3,
      top: 0,
      px: {
        base: '2',
        lg: '6',
      },
      w: 'full',
      overflow: 'hidden',
    },
  },
  Hero: {
    baseStyle: {
      backgroundGradient: {},
    },
  },
  Spinner: {
    baseStyle: {
      color: 'brand',
    },
  },
  Footer: {},
};

export const theme = extendTheme({ config, colors, styles, components });
