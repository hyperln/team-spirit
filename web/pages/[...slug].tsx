import path from 'path';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

import { config } from 'config';
import { PulseLoader } from '@components/atoms/spinners';
import { cmsFactory as cms } from '@lib/cms/cms';
import { CMSContentType, Page } from '@lib/cms/cms-types';
import { useContentSubscribe } from '@hooks/use-subscribe';
import { withFallback } from '@hoc/with-fallback';
import { Themes } from '@state/theme-types';
import { readFilesInDir } from '@utils/file-utils';
import { useLayoutData } from '@hooks/use-layout-data';
import { fetchStaticProps } from '@utils/dynamic-utils';
import { useColorMode } from '@hooks/use-color-mode';
import withTransition from '@hoc/with-transition';
import { withCheckRequireAuth } from '@hoc/with-auth';

const Templates = {
  default: dynamic(() =>
    import('@components/templates/dynamic-pages/dynamic-page-template'),
  ),
};

type Props = {
  page: Page;
  slug: string;
  preview: boolean;
};

function CatchAllPage({ page, preview, ...props }: Props): ReactElement {
  const { setColorMode } = useColorMode();
  const layout = useLayoutData();

  const content = (useContentSubscribe({
    initialData: page,
    contentType: CMSContentType.page,
    id: page.id,
    preview,
  }) as unknown) as Page;

  useEffect(() => {
    setColorMode(content.settings.darkTheme ? Themes.dark : Themes.light);
  }, [content]);

  const PageTemplate =
    Templates[content.settings.pageTemplate] || Templates.default;

  return (
    <>
      <Head>
        <title>
          {content.title} | {layout.header.title}
        </title>
      </Head>
      <NextSeo
        title={`${content.title} | ${layout.header.title}`}
        description={content.settings.description}
        openGraph={
          content.settings.openGraph?.enableOpenGraph
            ? {
                url: `${config.site.url}/${content.slug}`,
                title: content.settings.openGraph.title || content.title,
                description:
                  content.settings.openGraph.description ||
                  content.settings.description,
                images: [
                  {
                    url: cms({})
                      .getUrlForImage(content.settings.openGraph.image?.asset)
                      .width(1200)
                      .height(627)
                      .url(),
                    width: 1200,
                    height: 627,
                    alt: content.settings.openGraph.image?.alt,
                  },
                ],
              }
            : null
        }
      />
      <PageTemplate {...page} {...props} content={content} />
    </>
  );
}

export default withFallback(
  withTransition(withCheckRequireAuth(CatchAllPage)),
  PulseLoader,
);

export const getStaticProps: GetStaticProps = async (context) =>
  fetchStaticProps(context);

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = (await cms({}).query({
    type: CMSContentType.page,
    fallback: true,
  })) as Page[];

  const dir = path.join(process.cwd(), 'pages');
  const filenames = (await readFilesInDir(dir))
    .map((name) => name.split('pages/')[1].split('.')[0])
    .filter(
      (name) =>
        !['_app', '[', '_document'].some((value) => name.includes(value)),
    );

  const paths = pages
    .filter((page) => !filenames.includes(page.slug))
    .map((page) => ({
      params: {
        slug: page.slug.split('/'),
      },
    }));

  return {
    paths,
    fallback: true,
  };
};
