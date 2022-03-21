import { ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { format } from 'date-fns';

import { PulseLoader } from '@components/atoms/spinners';
import { cmsFactory } from '@lib/cms/cms';
import { Post, CMSContentType, ErrorContent } from '@lib/cms/cms-types';
import { useContentSubscribe } from '@hooks/use-subscribe';
import { withFallback } from '@hoc/with-fallback';
import { getSecondsByTimeUnit } from '@utils/time';
import { Heading } from '@components/atoms/typography/heading';
import { Box } from '@components/atoms/box';
import { BlockContent } from '@components/molecules/block-content/block-content';
import { Image } from '@components/atoms/image/image';
import { Text } from '@components/atoms/typography/text';
import { NextSeo } from 'next-seo';
import { useLayoutData } from '@hooks/use-layout-data';
import { config } from 'config';
import { toPlainText } from '@utils/string-utils';
import withTransition from '@hoc/with-transition';

type Props = {
  post: Post;
  preview: boolean;
  previewData: {
    token: string;
  };
};

function PostPage({ post, preview, previewData }: Props): ReactElement {
  const layout = useLayoutData();
  const content = useContentSubscribe({
    initialData: post,
    contentType: CMSContentType.post,
    preview,
    token: previewData?.token,
    id: post.id,
  }) as Post;

  return (
    <>
      <Head>
        <title>{content.title}</title>
      </Head>
      <NextSeo
        title={`${content.title} | ${layout.header.title}`}
        description={content.openGraph?.description}
        openGraph={
          content.openGraph
            ? {
                url: `${config.site.url}/${content.slug}`,
                title: content.openGraph.title || content.title,
                description:
                  content.openGraph.description || toPlainText(content.body),
                images: [
                  {
                    url: cmsFactory({})
                      .getUrlForImage(content.openGraph.image?.asset)
                      .width(1200)
                      .height(627)
                      .url(),
                    width: 1200,
                    height: 627,
                    alt: content.openGraph.image.alt,
                  },
                ],
              }
            : null
        }
      />
      <Box p="10">
        <Heading textAlign="center">{content.title}</Heading>
        <Box d="flex" justifyContent="center">
          <Image
            src={cmsFactory({ preview })
              .getUrlForImage(content.mainImage.asset)
              .size(100, 100)
              .url()}
          />
        </Box>
        <Text textAlign="center">
          Published: {format(new Date(content.publishedAt), 'MMMM d, y')}
        </Text>
        <BlockContent blocks={content.body} />
      </Box>
    </>
  );
}

export default withFallback(withTransition(PostPage), PulseLoader);

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug = '' } = context.params;
  const { preview = false, previewData = null } = context;
  const cms = cmsFactory({ preview });
  const post = (await cms.query({
    type: CMSContentType.post,
    slug: slug as string,
  })) as Post & ErrorContent;

  return {
    props: {
      key: post.id,
      preview,
      previewData,
      slug,
      ...(post && { post }),
      error: post?.error || !post,
      statusCode: post?.statusCode || !post ? 404 : 200,
      ...(post?.error && { errorPage: post?.page }),
    },
    revalidate: getSecondsByTimeUnit('day'),
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const cms = cmsFactory({});
  const posts = (await cms.query({
    type: CMSContentType.post,
  })) as Post[];
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));
  return {
    paths,
    fallback: true,
  };
};
