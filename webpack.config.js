const path = require('path');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const packageInformation = require('./package.json');

// const buildFolder = 'dist'
// module.exports = {
//   mode: 'development',
//   entry: {
//     web: path.resolve(__dirname, 'src', 'web', 'index.js')
//   },
//   devtool: 'inline-source-map',
//   devServer: {
//     static: `./${buildFolder}`,
//   },
//   resolve: {
//     extensions: ['.js']
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'babel-loader',
//             options: {
//               presets: [
//                 '@babel/react',
//                 '@babel/preset-env'
//               ],
//               plugins: [
//                 '@babel/plugin-syntax-dynamic-import',
//                 '@babel/plugin-proposal-class-properties',
//                 '@babel/plugin-proposal-optional-chaining',
//                 '@babel/plugin-proposal-nullish-coalescing-operator'
//               ]
//             }
//           }
//         ]
//       },
//       {
//         test: /\.scss$/,
//         exclude: /node_modules/,
//         use: [
//           // Creates `style` nodes from JS strings, its optinal if no css file exist
//           // "style-loader",
//           // Extracts CSS into separate files
//           MiniCssExtractPlugin.loader,
//           // Translates CSS into CommonJS
//           'css-loader',
//           // Compiles Sass to CSS
//           'sass-loader',
//         ]
//       },
//       {
//         test: /\.css$/,
//         exclude: /node_modules/,
//         use: ['css-loader']
//       },
//       {
//         test: /\.(png|jpg|svg|eot|woff|woff2|ttf)$/,
//         type: 'asset/resource'
//         // use: [
//         //   {
//         //     loader: 'file-loader',
//         //     options: {name: 'resources/[name].[ext]'}
//         //   }
//         // ]
//       },
//       {
//         test: /\.(handlebars|hbs)$/,
//         use: ['handlebars-loader']
//       }
//     ]
//   },
//   optimization: {
//     splitChunks: {
//       chunks: 'initial',
//       minSize: 0,
//       maxSize: 16000,
//       minChunks: 1,
//       maxAsyncRequests: 1,
//       maxInitialRequests: 1,
//       automaticNameDelimiter: '-',
//       name: false,
//       cacheGroups: {}
//     },
//     minimizer: [
//       // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
//       // `...`,
//       new CssMinimizerPlugin(),
//     ],
//   },
//   plugins: (() => {
//     const result = [
//       new HtmlWebpackPlugin({
//         filename: path.join(__dirname, buildFolder, 'express', 'index.html'),
//         meta: true ? {
//           charset: 'utf-8',
//           'X-UA-Compatible': 'IE=Edge',
//           'cache-control': 'no-store',
//           // only for backwards compatibility with HTTP/1.0 clients
//           pragma: 'no-store'
//         } : {
//           charset: 'utf-8',
//           'X-UA-Compatible': 'IE=Edge'
//         },
//         favicon: './favicon.ico',
//         template: path.join(__dirname, 'src', 'express', 'base.hbs'),
//         hash: true
//       }),
//       new MiniCssExtractPlugin({
//         filename: '[name].css',
//         chunkFilename: '[id].css'
//       }),
//       new webpack.ProvidePlugin({$: 'jquery'}),
//       new webpack.DefinePlugin({
//         'process.env.NODE_ENV': JSON.stringify('development'),
//         'process.env.VERSION': JSON.stringify(packageInformation.version)
//       }),
//       new CopyWebpackPlugin({
//         patterns: [
//           {from: './favicon.ico'},
//           {from: './favicon-nobrand.ico'}
//         ]
//       })
//     ];
//     if (false) {
//       result.push(new webpack.IgnorePlugin({resourceRegExp: /.*dev\/.*$/}));
//     }

//     if (false) {
//       if (true) {
//         result.push(new BundleAnalyzerPlugin());
//       }

//       result.push(
//         new ImageminPlugin({
//           test: /\.png$/i,
//           pngquant: {quality: 100}
//         })
//       );
//       result.push(
//         new CompressionWebpackPlugin({
//           filename: '[path]',
//           algorithm: 'gzip',
//           test: /\.(js|css|svg)$/,
//           threshold: 0,
//           minRatio: 1
//         })
//       );
//     }

//     return result;
//   })(),
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     clean: true,
//     publicPath: '/',
//   },
// };


module.exports = (env, argv = {}) => {
  const mode = argv.mode || 'development';
  const isDebug = mode === 'development';
  const isDisableMockServer = argv.disablemockserver || !isDebug;
  const isAnalyzeBuild = argv.analyzeBuild && !isDebug;
  const buildFolder = argv.buildFolder || 'dist';
  // { amd?, bail?, cache?, context?, dependencies?, devServer?, devtool?, entry?, experiments?, externals?, externalsPresets?, externalsType?, ignoreWarnings?, infrastructureLogging?, loader?, mode?, module?, name?, node?, optimization?, output?, parallelism?, performance?, plugins?, profile?, recordsInputPath?, recordsOutputPath?, recordsPath?, resolve?, resolveLoader?, snapshot?, stats?, target?, watch?, watchOptions? }

  return {
    target: 'web',
    mode: mode,
    entry: {
      web: path.resolve(__dirname, 'src', 'web', 'index.js')
    },
    devtool: 'inline-source-map',
    devServer: {
      static: `./${buildFolder}`,
      // host: config.webpackDevServer.host,
      // port: config.webpackDevServer.port,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Max-Age': '3000',
      //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      //   'Access-Control-Allow-Methods': 'GET'
      // },
      // proxy: {'/': `http://${config.webpackDevServer.host}:${config.expressServer.port}/`},
      open: true,
      // client: {
      //   overlay: true // show only compiler errors as a full-screen overlay
      // }
    },
    resolve: {
      extensions: ['.js']
    },
    output: {
      path: path.resolve(__dirname, buildFolder),
      // publicPath: '/',
      publicPath: isDebug ?
        `//${config.expressServer.host}:${config.expressServer.port}/` :
        '/assets/',
      // filename: '[name].js', // Default value in v5
      chunkFilename: '[name].[contenthash].js',
      assetModuleFilename: 'resources/[name].[ext]',
      clean: true
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
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator'
                ]
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            // Creates `style` nodes from JS strings, its optinal if no css file exist
            // "style-loader",
            // Extracts CSS into separate files
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ]
        },
        {
          test: /\.css$/,
          use: ['css-loader']
        },
        {
          test: /\.(png|jpg|svg|eot|woff|woff2|ttf)$/,
          type: 'asset/resource'
          // use: [
          //   {
          //     loader: 'file-loader',
          //     options: {name: 'resources/[name].[ext]'}
          //   }
          // ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'initial',
        minSize: 0,
        maxSize: 16000,
        minChunks: 1,
        maxAsyncRequests: 1,
        maxInitialRequests: 1,
        automaticNameDelimiter: '-',
        name: false,
        cacheGroups: {}
      },
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
    plugins: (() => {
      const result = [
        new HtmlWebpackPlugin({
          publicPath: '/',
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
          'process.env.NODE_ENV': JSON.stringify(mode),
          'process.env.VERSION': JSON.stringify(packageInformation.version)
        }),
        new CopyWebpackPlugin({
          patterns: [
            {from: './favicon.ico'},
            {from: './favicon-nobrand.ico'}
          ]
        })
      ];
      if (isDisableMockServer) {
        result.push(new webpack.IgnorePlugin({resourceRegExp: /.*dev\/.*$/}));
      }
      
      if (isAnalyzeBuild) {
        result.push(new BundleAnalyzerPlugin());
      }

      if (!isDebug) {
        result.push(
          new ImageminPlugin({
            test: /\.png$/i,
            pngquant: {quality: 100}
          })
        );
        result.push(
          new CompressionWebpackPlugin({
            test: /\.(js|css|svg)$/
          })
        );
      }

      return result;
    })()
  };
};
