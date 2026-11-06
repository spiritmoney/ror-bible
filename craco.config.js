const webpack = require('webpack');
const { execSync } = require('child_process');
const path = require('path');

function getGitShort() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: path.join(__dirname),
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

const REACT_APP_BUILD_ID = `${getGitShort()} · ${new Date().toISOString()}`;

module.exports = {
  style: {
    postOptions: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Append only — do not replace `webpackConfig.plugins` or CRA drops
      // WorkboxWebpackPlugin.InjectManifest and no build/service-worker.js is emitted.
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
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
      };
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env.REACT_APP_BUILD_ID': JSON.stringify(REACT_APP_BUILD_ID),
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
      return webpackConfig;
    },
  },
};
