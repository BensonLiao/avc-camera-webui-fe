const path = require('path');
const config = require('config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

module.exports = (env = {}) => {
  const buildFolder = env.buildFolder || 'dist';

  return {
    target: 'web',
    mode: env.mode === 'production' ? env.mode : 'development',
    entry: {
      web: path.join(__dirname, 'src', 'web', 'index.js'),
      error: path.join(__dirname, 'src', 'error', 'index.js')
    },
    devServer: {
      host: config.webpackDevServer.host,
      port: config.webpackDevServer.port,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '3000',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET'
      }
    },
    resolve: {
      extensions: ['.js']
    },
    output: {
      path: path.join(__dirname, buildFolder),
      publicPath: '/',
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                presets: [
                  ['react'],
                  ['es2015', {}]
                ]
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {loader: MiniCssExtractPlugin.loader},
            {loader: 'css-loader'},
            {
              loader: 'sass-loader',
              options: {includePaths: ['node_modules/']}
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {loader: MiniCssExtractPlugin.loader},
            {loader: 'css-loader'}
          ]
        },
        {
          test: /.*\.(eot|svg|woff|woff2|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {name: 'fonts/[name].[ext]'}
            }
          ]
        },
        {
          test: /.*\.(png|jpg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {name: 'images/[name].[ext]'}
            }
          ]
        }
      ]
    },
    plugins: (() => {
      const result = [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
        }),
        new webpack.ProvidePlugin({$: 'jquery'})
      ];
      if (env.mode === 'production') {
        result.push(new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: {removeAll: true}
          }
        }));
      }

      return result;
    })()
  };
};
