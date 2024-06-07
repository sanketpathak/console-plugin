/* eslint-env node */

import { ConsoleRemotePlugin } from '@openshift-console/dynamic-plugin-sdk-webpack';
import * as path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const CopyWebpackPlugin = require('copy-webpack-plugin');
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  mode: 'development',
  // No regular entry points. The remote container entry is handled by ConsoleRemotePlugin.
  entry: {},
  // entry: [
  //   './polyfills.js',
  //   '@console/app',
  //   'monaco-editor-core/esm/vs/editor/editor.worker.js',
  // ],
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js',
    chunkFilename: '[name]-chunk.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // fallback: {
    //   fs: false,
    //   path: require.resolve('path-browserify'),
    // },
    fallback: {
      fs: false,
      child_process: false,
      readline: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      'crypto-browserify': require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
    },
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
      // {
      //   test: /\.js$/,
      //   include: /node_modules\/@patternfly-4\//,
      //   loader: 'babel-loader',
      //   options: {
      //     plugins: [
      //       [
      //         'transform-imports',
      //         {
      //           // Transform all @patternfly/* imports to @patternfly-4/*
      //           '@patternfly\\/(\\S*)': {
      //             transform: (importName, matches) =>
      //               `@patternfly-4/${matches[1]}`,
      //             skipDefaultConversion: true,
      //           },
      //         },
      //       ],
      //     ],
      //   },
      // },
      {
        test: /\.scss$/,
        exclude:
          /node_modules\/(?!(@patternfly|@openshift-console\/plugin-shared|@openshift-console\/dynamic-plugin-sdk)\/).*/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  devServer: {
    static: './dist',
    port: 9001,
    // Allow bridge running in a container to connect to the plugin dev server.
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, Content-Type, Authorization',
      'Cache-Control': 'no-store',
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new ConsoleRemotePlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, 'locales'), to: 'locales' }],
    }),
    // new NodePolyfillPlugin(),
  ],
  devtool: 'source-map',
  optimization: {
    chunkIds: 'named',
    minimize: false,
  },
};

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
  if (config.output) {
    config.output.filename = '[name]-bundle-[hash].min.js';
    config.output.chunkFilename = '[name]-chunk-[chunkhash].min.js';
  }
  if (config.optimization) {
    config.optimization.chunkIds = 'deterministic';
    config.optimization.minimize = true;
  }
  config.devtool = false;
}

export default config;
