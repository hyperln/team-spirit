import { ReactElement } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '@theme/theme';

type ProviderProps = {
  children?: ReactElement | ReactElement[];
};

export function ThemeProvider({ children }: ProviderProps): JSX.Element {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
