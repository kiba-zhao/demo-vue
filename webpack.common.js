const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
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
    new CleanWebpackPlugin(['dist']),
    new VueLoaderPlugin()
  ]
};
