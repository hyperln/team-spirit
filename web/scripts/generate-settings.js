/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const prettier = require('prettier');

const cms = require('./cms');

module.exports = async () => {
  const [prettierConfig, settings] = await Promise.all([
    prettier.resolveConfig('./.prettierrc.js'),
    cms().getSettings(),
  ]);
  const formatted = prettier.format(JSON.stringify(settings), {
    ...prettierConfig,
    parser: 'json',
  });
  fs.writeFileSync('public/global-settings.json', formatted);
};
