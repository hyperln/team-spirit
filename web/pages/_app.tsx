import { DefaultSeo } from 'next-seo';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@state/theme-context';
import { StandardLayout } from '@components/templates/standard';
import settings from 'public/global-settings.json';
import { APIProvider } from '@lib/api/graphql/provider';
import { config } from 'config';

import { cmsFactory } from '@lib/cms/cms';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        openGraph={
          settings.openGraph
            ? {
                type: 'website',
                locale: settings.openGraph?.locale,
                url: config.site.url,
                site_name: settings.openGraph?.title,
                description: settings.openGraph?.description,
                images: [
                  {
                    url: cmsFactory({})
                      .getUrlForImage(settings.openGraph?.image?.asset)
                      .width(1200)
                      .height(627)
                      .url(),
                    width: 1200,
                    height: 627,
                    alt: settings.openGraph?.image?.alt,
                  },
                ],
              }
            : null
        }
      />
      <APIProvider>
        <ThemeProvider>
          <StandardLayout>
            <AnimatePresence exitBeforeEnter>
              <Component {...pageProps} />
            </AnimatePresence>
          </StandardLayout>
        </ThemeProvider>
      </APIProvider>
    </>
  );
}

export default MyApp;
