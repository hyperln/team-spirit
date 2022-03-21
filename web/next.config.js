/* eslint-disable global-require */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const generateRedirects = require('./scripts/generate-redirects');

module.exports = withBundleAnalyzer({
  webpack: (config, { isServer }) => {
    if (isServer) {
      require('./scripts/pre-build-script')();
    }
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          dgram: false,
          fs: false,
          net: false,
          tls: false,
          child_process: false,
        },
      };
    }
    config.module.rules.push({
      test: /\.(tsx|graphql)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react'],
          },
        },
        { loader: 'graphql-let/loader' },
      ],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: 'json',
      use: 'yaml-loader',
    });
    return config;
  },
  future: {
    webpack5: true,
  },
  async redirects() {
    return generateRedirects();
  },
  reactStrictMode: true,
});
