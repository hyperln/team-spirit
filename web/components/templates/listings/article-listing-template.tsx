import { useRouter } from 'next/router';
import { Box } from '@components/atoms/box';
import { Post } from '@lib/cms/cms-types';
import { Link } from '@components/atoms/link/link';
import { Text } from '@components/atoms/typography/text';
import { config } from 'config';
import { Image } from '@components/atoms/image/image';
import { cmsFactory } from '@lib/cms/cms';
import { Pagination } from '@components/molecules/pagination';

type Props = {
  articles: Post[];
  postsCount: number;
};

export function ArticleListingTemplate({ articles, postsCount }: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(postsCount / config.site.articles.pageSize);

  return (
    <Box margin={{ top: 'xlarge' }}>
      {articles?.map((article) =>
        new Date(article.publishedAt) < new Date() ? (
          <Link
            key={article.slug}
            href={`/${config.site.articles.pagePrefix}/${article.slug}`}
          >
            <Box
              _hover={{
                bg:
                  article.mainImage.asset.metadata.palette.dominant.background,
              }}
              d="flex"
            >
              <Image
                src={cmsFactory({})
                  .getUrlForImage(article.mainImage.asset)
                  .size(100, 100)
                  .url()}
              />
              <Text
                width="100%"
                _hover={{
                  textColor:
                    article.mainImage.asset.metadata.palette.dominant
                      .foreground,
                }}
              >
                {article.title}
              </Text>
            </Box>
          </Link>
        ) : null,
      )}
      {totalPages > 1 ? (
        <Pagination
          totalPages={totalPages}
          currentPage={parseInt(router.query.pageNumber as string, 10) || 1}
          pageUrl={`/${config.site.articles.pagePrefix}/page`}
        />
      ) : null}
    </Box>
  );
}
