import { cmsFactory as cms } from '@lib/cms/cms';
import { CMSContentType, ErrorContent, Page, Post } from '@lib/cms/cms-types';
import { config } from 'config';
import { GetStaticProps, GetStaticPropsResult } from 'next';
import { pipe } from './functional-utils';
import { getSecondsByTimeUnit } from './time';

// async function fetchSupportStaticProps({ preview, previewData, route }) {
//   const [articles, postsCount] = await Promise.all([
//     cms({ preview }).query({
//       type: CMSContentType.supportArticle,
//       limit: config.site.supportArticles.pageSize,
//       order: 'publishedAt desc',
//       customQuery: `publishedAt <= "${new Date().toISOString()}"`,
//     }) as Promise<Post>,
//     cms({ preview }).getDocumentCount({
//       type: CMSContentType.supportArticle,
//       customQuery: `publishedAt <= "${new Date().toISOString()}"`,
//     }),
//   ]);

//   return {
//     props: {
//       preview,
//       previewData,
//       route,
//       articles,
//       postsCount,
//       page: route?.page || null,
//       error: route?.error || !route?.page,
//       statusCode: route?.statusCode || !route?.page ? 404 : 200,
//       ...(route?.error && { errorPage: route?.page }),
//     },
//     revalidate: getSecondsByTimeUnit('day'),
//   };
// }

async function fetchArticleListingStaticProps({ page, preview, previewData }) {
  const [articles, postsCount] = await Promise.all([
    cms({ preview }).query({
      type: CMSContentType.post,
      limit: config.site.articles.pageSize,
      order: 'publishedAt desc',
      customQuery: `publishedAt <= "${new Date().toISOString()}"`,
    }) as Promise<Post>,
    cms({ preview }).getDocumentCount({
      type: CMSContentType.post,
      customQuery: `publishedAt <= "${new Date().toISOString()}"`,
    }),
  ]);

  return {
    props: {
      key: page.id,
      preview,
      previewData,
      articles,
      postsCount,
      page: !page ? null : page?.slug !== '404' ? page : null,
      error: page?.slug === '404' || !page,
      statusCode: page?.slug === '404' || !page ? 404 : 200,
      errorPage: page?.slug === '404' ? page : null,
    },
    revalidate: getSecondsByTimeUnit('day'),
  };
}

async function fetchDefaultStaticProps({ page, preview, previewData, slug }) {
  return {
    props: {
      key: page.id,
      preview,
      previewData,
      slug,
      page: !page ? null : page?.slug !== '404' ? page : null,
      error: page?.slug === '404' || !page,
      statusCode: page?.slug === '404' || !page ? 404 : 200,
      errorPage: page?.slug === '404' ? page : null,
    },
    revalidate: getSecondsByTimeUnit('day'),
  };
}

const templatePropFetchers = {
  // supportPage: fetchSupportStaticProps,
  articleListingPage: fetchArticleListingStaticProps,
  default: fetchDefaultStaticProps,
};

const fetchProps = async ({
  page,
  ...rest
}): Promise<GetStaticPropsResult<{ [key: string]: any }>> => {
  const fn =
    templatePropFetchers[page.settings.pageTemplate] ||
    templatePropFetchers.default;
  return fn({ page, ...rest });
};

const fetchRoute = async ({ preview, slug, ...rest }) => {
  const page = (await cms({ preview }).query({
    type: CMSContentType.page,
    slug: slug.join('/'),
  })) as Page & ErrorContent;
  return {
    preview,
    slug,
    page,
    ...rest,
  };
};

export const fetchStaticProps: GetStaticProps = async (context) => {
  const { slug = [''] } = context.params as { slug: string[] };
  const { preview = false, previewData = null } = context;
  return pipe.async(fetchRoute, fetchProps)({ slug, preview, previewData });
};
