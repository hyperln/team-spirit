/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const prettier = require('prettier');

const cms = require('./cms');

module.exports = async () => {
  const [prettierConfig, layout] = await Promise.all([
    prettier.resolveConfig('./.prettierrc.js'),
    cms().getLayout()
  ]);
  const formatted = prettier.format(JSON.stringify(layout), {
    ...prettierConfig,
    parser: 'json',
  });
  fs.writeFileSync('public/layout.json', formatted);
};