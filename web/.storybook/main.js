const path = require('path');

module.exports = {
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  stories: ['../stories/**/*.stories.js', '../components/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config /*, { configType }*/) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules'];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@common': path.resolve(__dirname, '../common'),
      '@components': path.resolve(__dirname, '../components'),
      '@hoc': path.resolve(__dirname, '../hoc'),
      '@hooks': path.resolve(__dirname, '../hooks'),
      '@lib': path.resolve(__dirname, '../lib'),
      '@utils': path.resolve(__dirname, '../utils'),
      '@state': path.resolve(__dirname, '../state'),
      '@theme': path.resolve(__dirname, '../theme'),
    };

    return config;
  },
};
