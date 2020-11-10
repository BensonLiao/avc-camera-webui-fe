const path = require('path');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const packageInformation = require('./package.json');

module.exports = (env = {}) => {
  const isDebug = (env.mode || 'development') === 'development';
  const isDisableMockServer = env.disablemockserver === 'true' || !isDebug;
  const isAnalyzeBuild = env.analyzeBuild === 'true' && !isDebug;
  const buildFolder = env.buildFolder || 'dist';

  return {
    target: 'web',
    mode: env.mode || 'development',
    entry: {web: path.join(__dirname, 'src', 'web', 'index.js')},
    devServer: {
      host: config.webpackDevServer.host,
      port: config.webpackDevServer.port,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '3000',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET'
      },
      proxy: {'/': `http://${config.webpackDevServer.host}:${config.expressServer.port}/`},
      open: true,
      overlay: {
        warnings: true,
        errors: true
      }
    },
    resolve: {extensions: ['.js']},
    output: {
      path: path.join(__dirname, buildFolder),
      publicPath: isDebug ?
        `//${config.webpackDevServer.host}:${config.webpackDevServer.port}/` :
        '/assets/',
      filename: '[name].js',
      chunkFilename: '[name].[contenthash].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/react',
                  '@babel/preset-env'
                ],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                  '@babel/plugin-proposal-class-properties'
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
              options: {sassOptions: {includePaths: ['node_modules/']}}
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
          test: /\.(png|jpg|svg|eot|woff|woff2|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {name: 'resources/[name].[ext]'}
            }
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'initial',
        minSize: 16000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 1,
        maxInitialRequests: 1,
        automaticNameDelimiter: '-',
        name: true,
        cacheGroups: {}
      }
    },
    plugins: (() => {
      const result = [
        new HtmlWebpackPlugin({
          filename: path.join(__dirname, buildFolder, 'express', 'index.html'),
          meta: isDebug ? {
            charset: 'utf-8',
            'X-UA-Compatible': 'IE=Edge',
            'cache-control': 'no-store',
            // only for backwards compatibility with HTTP/1.0 clients
            pragma: 'no-store'
          } : {
            charset: 'utf-8',
            'X-UA-Compatible': 'IE=Edge'
          },
          favicon: './favicon.ico',
          template: path.join(__dirname, 'src', 'express', 'base.hbs'),
          hash: true
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
        }),
        new webpack.ProvidePlugin({$: 'jquery'}),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env.mode || 'development'),
          'process.env.VERSION': JSON.stringify(packageInformation.version)
        }),
        new CopyWebpackPlugin([
          {from: './favicon.ico'},
          {from: './favicon-nobrand.ico'}
        ])
      ];
      if (isDisableMockServer) {
        result.push(new webpack.IgnorePlugin(/.*dev\/.*$/));
      }

      if (!isDebug) {
        if (isAnalyzeBuild) {
          result.push(new BundleAnalyzerPlugin());
        }

        result.push(new OptimizeCSSAssetsPlugin({cssProcessorOptions: {discardComments: {removeAll: true}}}));
        result.push(
          new ImageminPlugin({
            test: /\.png$/i,
            pngquant: {quality: 100}
          })
        );
        result.push(
          new CompressionWebpackPlugin({
            filename: '[path]',
            algorithm: 'gzip',
            test: /\.(js|css|svg)$/,
            threshold: 0,
            minRatio: 1
          })
        );
      }

      return result;
    })()
  };
};
