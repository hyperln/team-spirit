import type { AppProps } from 'next/app';
import { ThemeProvider } from '@theme/theme-context';
import { Layout } from '@components/templates/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
