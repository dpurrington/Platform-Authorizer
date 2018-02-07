const { join } = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const { lib: { entries: entry }} = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry,
  target: 'node',
  stats: 'errors-only',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        options: {
          baseConfig: {
            extends: [
              'eslint:recommended',
              'standard',
              'plugin:import/errors',
              'plugin:import/warnings',
              'plugin:promise/recommended'
            ]
          },
          parserOptions: {
            ecmaVersion: 2017,
            ecmaFeatures: {
              impliedStrict: true
            },
            sourceType: 'module'
          },
          envs: [ 'node', 'es6' ],
          rules: {
            'no-console': 'off'
          },
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'transform-runtime',
              {
                polyfill: false,
                regenerator: true
              }
            ]
          ],
          presets: [
            [
              'env',
              {
                targets: {
                  node: '6.10'
                }
              }
            ]
          ]
        },
        exclude: /node_modules/
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs2',
    path: join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  externals: [ nodeExternals() ],
  plugins: [ new MinifyPlugin() ]
};
