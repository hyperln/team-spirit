const generateLayout = require('./generate-layout');
const generateSettings = require('./generate-settings');
const generateSiteMap = require('./generate-sitemap');

const siteConfig = {
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  accessToken: process.env.BIGCOMMERCE_ACCESS_TOKEN,
  storeHash: process.env.NEXT_PUBLIC_STORE_HASH,
  graphQLUrl: process.env.NEXT_PUBLIC_BIGCOMMERCE_GRAPHQL_URL,
};

const preBuild = () => {
  generateSiteMap(siteConfig);
  generateLayout();
  generateSettings();
};

preBuild();

module.exports = preBuild;
