import jsdom from 'jsdom';

import blockTools from '@sanity/block-tools';
import Schema from '@sanity/schema';

export const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'content',
      fields: [
        {
          title: 'Title',
          type: 'string',
          name: 'title',
        },
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    },
  ],
});

const blockContentType = defaultSchema
  .get('content')
  .fields.find((field: any) => field.name === 'body').type;

export const htmlToBlocks = (htmlString: string) => {
  try {
    const { JSDOM } = jsdom;
    const blocks = blockTools.htmlToBlocks(htmlString, blockContentType, {
      parseHtml: (html: string) =>
        new JSDOM(`<html><body>${html}</body></html>`).window.document,
    });
    return blocks;
  } catch (error) {
    console.error(error);
  }
};
