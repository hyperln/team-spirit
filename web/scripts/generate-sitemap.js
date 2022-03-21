/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

const cms = require('./cms');

module.exports = async (config) => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  const [staticPages, blogPosts, dynamicPages] = await Promise.all([
    globby([
      'pages/**/*.tsx',
      '!pages/_*.tsx',
      '!pages/api',
      '!pages/404.tsx',
      '!pages/500.tsx',
      '!pages/blog/[slug].tsx',
      '!pages/blog/[slug].tsx',
    ]),
    cms().getBlogPosts(),
    cms().getDynamicPages(),
  ]);
  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${staticPages
              .map((page) => {
                const path = page.replace('pages', '').replace('.tsx', '');
                const route = path === '/index' ? '' : path;
                return (
                  !route.includes('[') &&
                  `
                        <url>
                            <loc>${`${config.site.url}${route}`}</loc>
                            <changefreq>daily</changefreq>
                            <priority>0.7</priority>
                        </url>
                    `
                );
              })
              .filter(Boolean)
              .join('')}
              ${dynamicPages
                .map(
                  (route) => `
                        <url>
                            <loc>${`${config.site.url}/${route}`}</loc>
                            <changefreq>daily</changefreq>
                            <priority>0.7</priority>
                        </url>
                    `,
                )
                .join('')}
              ${blogPosts
                .map(
                  (route) => `
                        <url>
                            <loc>${`${config.site.url}/blog/${route}`}</loc>
                            <changefreq>daily</changefreq>
                            <priority>0.7</priority>
                        </url>
                    `,
                )
                .join('')}
        </urlset>
    `;

  // If you're not using Prettier, you can remove this.
  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  fs.writeFileSync('public/sitemap.xml', formatted);
};
