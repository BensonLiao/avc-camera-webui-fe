const fs = require('fs');
const path = require('path');
const config = require('config');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const packageInformation = JSON.parse(fs.readFileSync('package.json'));

module.exports = (env = {}) => {
  const isDebug = (env.mode || 'development') === 'development';
  const isDisableMockServer = env.disablemockserver === 'true' || !isDebug;
  const isAnalyzeBuild = env.analyzeBuild === 'true' && !isDebug;
  const buildFolder = env.buildFolder || 'dist';

  return {
    target: 'web',
    mode: env.mode || 'development',
    entry: {
      'en-us': path.join(__dirname, 'src', 'languages', 'en-us.js'),
      'es-es': path.join(__dirname, 'src', 'languages', 'es-es.js'),
      'ja-jp': path.join(__dirname, 'src', 'languages', 'ja-jp.js'),
      'zh-tw': path.join(__dirname, 'src', 'languages', 'zh-tw.js'),
      'zh-cn': path.join(__dirname, 'src', 'languages', 'zh-cn.js'),
      web: path.join(__dirname, 'src', 'web', 'index.js')
    },
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
      open: true
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
          test: /\.(eot|svg|woff|woff2|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {name: 'resources/[name].[ext]'}
            }
          ]
        },
        {
          test: /\.(png|jpg)$/,
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
          {from: './favicon.ico'}
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
