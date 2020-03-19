/**
 * @fileOverview webpack配置文件
 * @name webpack.config.js
 * @author kiba.x.zhao <xiafeng@aegleanalytica.io>
 * @license MIT
 */
'use strict';

const path = require('path');

const merge = require('webpack-merge');

const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { name: title, dependencies } = require('./package.json');

const common = {
  entry: {
    app: './src/app.js',
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve('node_modules')
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', 'css-loader'
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ title, chunks: ['app'] }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['dist'])
  ]
};

const dev = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()]
});

const prod = merge(common, {
  devtool: 'source-map',
  externals: [
    ...Object.keys(dependencies || {})
  ]
});

module.exports = function(env) {
  return env && env.production ? prod : dev;
};

