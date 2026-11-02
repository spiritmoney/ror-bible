const webpack = require('webpack');

module.exports = {
  style: {
    postOptions: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          assert: require.resolve('assert'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify'),
          url: require.resolve('url'),
          path: require.resolve('path-browserify'),
          fs: require.resolve('browserify-fs'),
          timers: require.resolve('timers-browserify'),
        },
      },
      // optimization: {
      //   splitChunks: {
      //     chunks: 'async',
      //     minSize: 20000,
      //     minRemainingSize: 0,
      //     minChunks: 1,
      //     maxAsyncRequests: 30,
      //     maxInitialRequests: 30,
      //     enforceSizeThreshold: 50000,
      //     cacheGroups: {
      //       defaultVendors: {
      //         test: /[\\/]node_modules[\\/]/,
      //         priority: -10,
      //         reuseExistingChunk: true,
      //       },
      //       base: {
      //         // Basic framework
      //         chunks: 'all',
      //         test: /(react|react-dom|react-dom-router)/,
      //         name: 'base',
      //         priority: 100,
      //       },
      //       default: {
      //         minChunks: 2,
      //         priority: -20,
      //         reuseExistingChunk: true,
      //       },
      //       commons: {
      //         chunks: 'all',
      //         // Pack the modules shared by more than two chunk s into the commons group.
      //         minChunks: 2,
      //         name: 'commons',
      //         priority: 80,
      //       },
      //     },
      //   },
      // },
    },
    plugins: [
      // fix "process is not defined" error:
      // (do "npm install process" before running the build)
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
};
