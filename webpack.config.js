'use strict';

const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const SCSS_LOADER = 'style-loader!css-loader?modules=true&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!sass-loader';
const extarctSCSS = [
  MiniCssExtractPlugin.loader,
  'css-loader?module&importLoaders=1&localIdentName=[hash:base64:5]!sass-loader'
];

const CSS_LOADER = 'style-loader!css-loader';
const extarctCSS = [
  MiniCssExtractPlugin.loader,
  'css-loader'
];

const config = {
  context: path.join(__dirname, 'src'),

  entry: {
    app: 'index.tsx'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  resolve: {
    modules: [path.resolve('src'), path.resolve('node_modules')],
    extensions: ['.web.js', '.js', '.tsx', '.ts', '.json', '.scss', '.css', '.ejs'],
  },

  devtool: NODE_ENV === 'development' ? 'source-map' : 'eval',
  mode: NODE_ENV,
  target: 'web',

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'tslint-loader',
        options: {
          configFile: './tslint.json'
        }
      },
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'source-map-loader'
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: NODE_ENV === 'development' ? SCSS_LOADER : extarctSCSS,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: NODE_ENV === 'development' ? CSS_LOADER : extarctCSS,
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|otf|ttf|eot|svg)$/,
        loader: 'file-loader?name=[path][name].[ext]?[hash:base64:5]',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name:'[path][name].[ext]?[hash:base64:5]'
            }
          }]
      },
    ],
  },

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    hot: true,
    historyApiFallback: true,
    inline: true,
    host: 'localhost',
    port: 9092,
    stats: {
      assets: true,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunks: true,
      chunkModules: true,
      optimizationBailout: true
    },
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: 'templates/index.ejs',
      inject: 'body',
      hash: true
    })
  ]
};

if (NODE_ENV === 'production') {
  config.plugins.push(
    new UglifyJsPlugin({
      sourceMap: false
    })
  )
}

if (NODE_ENV === 'development') {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = config;
