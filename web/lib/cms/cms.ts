import sanityClient, { SanityClient } from '@sanity/client';
import sanityImage from '@sanity/image-url';
import groq from 'groq';

import { config } from 'config';
import {
  CMSContent,
  CMSContentType,
  CMSFactoryConfig,
  CMSInterfaceMethods,
  Subscription,
} from './cms-types';

const options = {
  dataset: config.cms.dataset,
  projectId: config.cms.projectId,
  useCdn: config.cms.useCdn,
  apiVersion: '2021-05-21',
  token: process.env.SANITY_API_TOKEN,
};

export const regularClient = sanityClient(options);

export const syncClient = (dataset = 'production') =>
  sanityClient({
    ...options,
    dataset,
    token: process.env.SANITY_SYNC_TOKEN,
  });

export const imageBuilder = sanityImage(regularClient);

const listenerClient = () =>
  sanityClient({
    ...options,
    useCdn: false,
    withCredentials: true,
  });

const linkFields = `
'link': navItemAction{
  href,
  anchorLink,
  'slug': pageRoute->slug.current,
  'id': pageRoute->_id
}
`;

const navFields = `
items[]{
  text,
  _key,
  'kind': navItemAction.kind,
  style,
  icon{
    dark{
      ...,
      alt,
      asset->{...}
    },
    light{
      ...,
      alt,
      asset->{...}
    }
  },
  'function': navItemAction.triggerFunction,
  ${linkFields}
}
`;

const ctaFields = `
  ...,
  'ctaButtons': ctaButtons[]{
    ...,
    'landingPageRoute': landingPageRoute->{
      'id': _id
    }
  },
`;

const sectionsFields = `
  'key': _key,
  'type': _type,
  anchor,
  'background': background{
    'alt': image.alt,
    'imageUrl': image.asset->url,
  },
  ${ctaFields}
  'cta': cta{
    ${ctaFields}
  },
  'menu': menu->{
    ${navFields}
  },
  ...,
`;

const pageFields = `
  'updatedAt': _updatedAt,
  settings{
    ...,
  },
  parentPage->{
  	...,
    'slug': slug.current,
	},
  title,
  'slug': slug.current,
  'id': _id,
  'sections': sections[]{
    ${sectionsFields}
  },
`;

const postFields = `
  'id': _id,
  name,
  title,
  publishedAt,
  body,
  excerpt,
  'slug': slug.current,
  mainImage{
    ...,
    asset->{...}
  },
  'author': author->{name, 'picture': picture.asset->url},
  'page': page->{${pageFields}}
`;

const routeFields = `
  'id': _id,
  'slug': slug.current,
  'page': page->{${pageFields}}
`;

const staticRouteFields = `
  'id': _id,
  'page': page->{${pageFields}}
`;

const globalLayoutSettingsFields = `
  ...,
  'id': _id,
  'footer': footer{
    ...,
  	'logo': logo{
			...,
  		'asset': asset->{...}
		}
	},
	'header': header{
  	...,
    'primaryNav': primaryNav->{
    	${navFields}
  	},
    'secondaryNav': secondaryNav->{
    	${navFields}
  	},
  	'logo': logo{
			...,
  		'asset': asset->{...}
		}
	}
`;

const contentFields = {
  [CMSContentType.post]: postFields,
  [CMSContentType.page]: pageFields,
  [CMSContentType.route]: routeFields,
  [CMSContentType.staticRoute]: staticRouteFields,
  [CMSContentType.globalSiteLayout]: globalLayoutSettingsFields,
};

const getClient = (preview: boolean) =>
  preview ? listenerClient() : regularClient;

export function getSecret(): string {
  return process.env.SANITY_PREVIEW_SECRET as string;
}

export async function getAllByType({
  type,
  client,
  limit,
  offset = 0,
  order = '_updatedAt desc',
  customQuery,
}: {
  type: CMSContentType;
  client: SanityClient;
  limit?: number;
  offset?: number;
  order: string;
  customQuery?: string;
}): Promise<CMSContent[]> {
  const slice = limit ? `[${offset}...${limit}]` : '';
  const cq = customQuery ? `&& ${customQuery}` : '';
  const query = groq`
  *[_type == $type ${cq}] | order(${order}) ${slice}{
    ${contentFields[type]}
  }
  `;
  const data = await client.fetch(query, { type });
  return data;
}

export async function getSingleByType(
  type: CMSContentType,
  slug = '',
  client: SanityClient,
): Promise<CMSContent> {
  const query = groq`
  *[_type == $type && slug.current == $slug || slug.current == '404'] | order(_type asc, _updatedAt desc){
      ${contentFields[type]}
    }
  `;
  const data = await client.fetch(query, { type, slug });
  return data.length > 1 ? data.find((d) => d.slug !== '404') : data[0];
}

export async function getById(
  type: CMSContentType,
  id: string,
  client: SanityClient,
): Promise<CMSContent> {
  const query = groq`
    *[_id == $id || (_id in path("drafts." + $id))] | order(_updatedAt desc) {
      ${contentFields[type]}
    }
  `;
  const data = await client.fetch(query, { id });
  return data[0];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function subscribeToType(
  {
    type,
    slug = '',
    client,
  }: {
    type: CMSContentType;
    slug: string;
    client: SanityClient;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (update: any) => void,
): Subscription {
  const query = groq`
  *[_type == $type && slug.current == $slug] {
      ${contentFields[type]}
    }
  `;

  const subscription = client.listen(query, { type, slug }).subscribe(
    (update) => {
      callback(update);
    },
    // eslint-disable-next-line no-console
    (error) => console.error(error),
  );
  return (subscription as unknown) as Subscription;
}

export function subscribeById(
  {
    type,
    id,
    client,
  }: {
    type: CMSContentType;
    id: string;
    client: SanityClient;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (update: any) => void,
): Subscription {
  const query = groq`
  *[_id == $id || (_id in path("drafts." + $id))] {
      ${contentFields[type]}
    }
  `;

  const subscription = client.listen(query, { id }).subscribe(
    (update) => {
      callback(update);
    },
    // eslint-disable-next-line no-console
    (error) => console.error(error),
  );
  return (subscription as unknown) as Subscription;
}

const withResponseChecker = (query: Function) => async (...params: any) => {
  const content = await query(...params);
  return content?.id === '404'
    ? {
        error: true,
        statusCode: 404,
        ...content,
      }
    : content;
};

export const getDocumentCount = async ({
  client,
  type,
  customQuery,
}: {
  client: SanityClient;
  type: CMSContentType;
  customQuery?: string;
}) => {
  const cq = customQuery ? `&& ${customQuery}` : '';
  const query = groq`
    count(*[_type == $type${cq}])
  `;
  const data = await client.fetch(query, { type });
  return data;
};

/**
 * CMS interface factory
 * Returns an object with all CMS interface methods
 *
 * @param config
 */
export function cmsFactory({
  preview = false,
}: CMSFactoryConfig): CMSInterfaceMethods {
  const client = getClient(preview);
  return {
    subscribeToType: ({ type, slug, id }, callback) =>
      id
        ? subscribeById({ type, id, client }, callback)
        : subscribeToType({ type, slug, client }, callback),
    query: ({ type, slug, limit, offset, order, customQuery }) =>
      slug
        ? withResponseChecker(getSingleByType)(type, slug, client)
        : getAllByType({ type, client, limit, offset, order, customQuery }),
    getById: ({ id, type }) => getById(type, id, client),
    getSecret,
    getToken: () => process.env.SANITY_API_TOKEN,
    getSiteLayout: () =>
      getById(
        CMSContentType.globalSiteLayout,
        CMSContentType.globalSiteLayout,
        client,
      ),
    getUrlForImage: (source) => imageBuilder.image(source),
    getDocumentCount: ({ type, customQuery }) =>
      getDocumentCount({ client, type, customQuery }),
  };
}
