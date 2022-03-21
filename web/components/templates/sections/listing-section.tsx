/* eslint-disable react/no-unused-prop-types */
import { ListingType, Post } from '@lib/cms/cms-types';
import { ArticleListingTemplate } from '../listings/article-listing-template';

type Props = {
  articles?: Post[];
  listingType: ListingType;
  type: 'listing';
  postsCount: number;
};

const listingComponents = {
  [ListingType.newsArticles]: ({ articles, ...props }: Props) => (
    <ArticleListingTemplate {...props} articles={articles} />
  ),
};

export function ListingSection(props: Props) {
  return listingComponents[props.listingType]
    ? listingComponents[props.listingType](props)
    : null;
}
