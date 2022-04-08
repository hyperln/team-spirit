import type { AppProps } from 'next/app';
import { ThemeProvider } from '@theme/theme-context';
import { Layout } from '@components/templates/layout';
import { ProfileProvider } from '@state/profile-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default MyApp;
