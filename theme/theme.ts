import { mode } from '@chakra-ui/theme-tools';
import { ColorMode, extendTheme } from '@chakra-ui/react';

export const config = {
  initialColorMode: 'light' as ColorMode,
  useSystemColorMode: true,
};

export const colors = {
  brand: {
    50: '#4aaad3',
    100: '#277DA1',
    200: '#247294',
    300: '#206683',
    400: '#1c5973',
    500: '#184c63',
    600: '#143f52',
    700: '#103342',
    800: '#0c2631',
    900: '#081921',
  },
  link: 'red',
  footer: {
    background: '#ecf0f5',
    title: '#515b69',
    linkItem: '#72849c',
    copyright: '#7f8795',
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
  Footer: {},
};

export const theme = extendTheme({ config, colors, styles, components });
