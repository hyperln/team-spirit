import type { AppProps } from 'next/app';
import { ThemeProvider } from '@theme/theme-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
