import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PulseLoader } from '@components/atoms/spinners';
import { withFallback } from '@hoc/with-fallback';
import { useContentSubscribe } from '@hooks/use-subscribe';
import { cmsFactory } from '@lib/cms/cms';
import { CMSContentType, ErrorContent, Page, Post } from '@lib/cms/cms-types';
import { getSecondsByTimeUnit } from '@utils/time';
import { config } from 'config';
import PagebuilderTemplate from '@components/templates/dynamic-pages/pagebuilder-template';
import { useColorMode } from '@hooks/use-color-mode';
import { Themes } from '@state/theme-types';
import withTransition from '@hoc/with-transition';

type Props = {
  page: Page;
  preview: boolean;
  previewData: {
    token: string;
  };
  articles: Post[];
  postsCount: number;
};

function ArticleListingPage({ page, preview, previewData, ...props }: Props) {
  const { setColorMode } = useColorMode();
  const router = useRouter();
  useEffect(() => {
    if (router.query.pageNumber === '1') {
      router.push(`/${config.site.articles.pagePrefix}`);
    }
  }, []);
  const content = (useContentSubscribe({
    initialData: page,
    contentType: CMSContentType.page,
    id: page.id,
    preview,
    token: previewData?.token,
  }) as unknown) as Page;

  useEffect(() => {
    setColorMode(content.settings.darkTheme ? Themes.dark : Themes.light);
  }, [content]);

  return (
    <>
      <Head>
        <title>{content.title}</title>
      </Head>
      <PagebuilderTemplate {...props} content={{ ...content }} />
    </>
  );
}

export default withFallback(withTransition(ArticleListingPage), PulseLoader);

export const getStaticProps: GetStaticProps = async (context) => {
  const { pageNumber = '' } = context.params;
  const { preview = false, previewData = null } = context;
  const [page, articles, postsCount] = await Promise.all([
    cmsFactory({ preview }).query({
      type: CMSContentType.page,
      slug: config.site.articles.pagePrefix,
    }) as Promise<Page & ErrorContent>,
    cmsFactory({ preview }).query({
      type: CMSContentType.post,
      limit: config.site.articles.pageSize * parseInt(pageNumber as string, 10),
      offset:
        config.site.articles.pageSize * parseInt(pageNumber as string, 10) -
        config.site.articles.pageSize,
      order: 'publishedAt desc',
      customQuery: `publishedAt <= "${new Date().toISOString()}"`,
    }) as Promise<Post>,
    cmsFactory({ preview }).getDocumentCount({
      type: CMSContentType.post,
      customQuery: `publishedAt <= "${new Date().toISOString()}"`,
    }),
  ]);

  return {
    props: {
      key: pageNumber,
      preview,
      previewData,
      articles,
      postsCount,
      page: !page ? null : page?.slug !== '404' ? page : null,
      error: page?.slug === '404' || !page,
      statusCode: page?.slug === '404' || !page ? 404 : 200,
      errorPage: page?.slug === '404' ? page : null,
    },
    revalidate: getSecondsByTimeUnit('minute'),
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsCount = await cmsFactory({}).getDocumentCount({
    type: CMSContentType.post,
    customQuery: `publishedAt <= "${new Date().toISOString()}"`,
  });
  const totalPages = Math.ceil(postsCount / config.site.articles.pageSize);
  const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 1);
  const paths = pageNumbers.map((pageNumber) => ({
    params: {
      pageNumber: `${pageNumber}`,
    },
  }));
  return {
    paths,
    fallback: true,
  };
};
