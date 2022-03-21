const sanityClient = require('@sanity/client');
const groq = require('groq');

async function getBlogPosts(client) {
  const query = groq`
    *[_type == 'post'] {
      'slug': slug.current,
    }
  `;
  const data = await client.fetch(query);
  return data.map(({ slug }) => slug);
}

async function getDynamicPages(client) {
  const query = groq`
    *[_type == 'page' && !(slug.current in ['index', '404']) && settings.includeInSitemap != false] {
      'slug': slug.current,
    }
  `;
  const data = await client.fetch(query);
  return data.map(({ slug }) => slug);
}

const linkFields = `
'link': navItemAction{
  'href': link,
  anchorLink,
  'slug': page->slug.current,
  'id': page->_id
},
subItems[]{
  'link': navItemAction{
    href,
    anchorLink,
    'slug': page->slug.current,
    'id': page->_id,
  },
  text,
  _key,
}
`;

const navFields = `
  text,
  _key,
  'kind': navItemAction.kind,
  style,
  'icon': icon{
    alt,
    asset->{...}
  },
  'function': navItemAction.triggerFunction,
  ${linkFields}
`;

const navItems = `
items[]{
  ${navFields}
}
`;

async function getLayout(client) {
  const query = groq`
    *[_id == "globalSiteLayout"][0] {
      ...,
      'id': _id,
      'footer': tabs.footer{
        ...,
        'logo': logo{
          ...,
          'asset': asset->{...}
        },
        nav->{
          items[]{
            _type,
            title,
            ${navFields},
            ${navItems},
          },
        }
      },
      'header': tabs.header{
        ...,
        primaryNav->{
          items[]{
            _type,
            title,
          ${navFields}
          }
        },
        secondaryNav->{
          items[]{
            _type,
            title,
          ${navFields}
          }
        },
        'logo': logo{
          ...,
          'asset': asset->{...}
        }
      },
      'cookieConsent': tabs.cookieConsent{
        ...,
        cookiePolicyLink->{
          ...,
          'slug': slug.current,
        },
        privacyPolicyLink->{
          ...,
          'slug': slug.current,
        },
        icon{
          ...,
          asset->{
            ...
          }
        }
      }
    }
  `;
  const data = await client.fetch(query);
  return data;
}

async function getRedirects(client) {
  const query = groq`
    *[_type == 'redirect'] {
      destination,
      source,
      permanent
    }
  `;
  const data = await client.fetch(query);
  return data;
}

async function getSettings(client) {
  const query = groq`
    *[_id == "siteSettings"][0] {
      ...,
    }
  `;
  const data = await client.fetch(query);
  return data;
}

module.exports = function cms() {
  const options = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
  };

  const client = sanityClient(options);

  return {
    getBlogPosts: () => getBlogPosts(client),
    getDynamicPages: () => getDynamicPages(client),
    getLayout: () => getLayout(client),
    getRedirects: () => getRedirects(client),
    getSettings: () => getSettings(client),
  };
};
