const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  externals: {
    vue: 'vue',
    vuex: 'vuex',
    bootstrap: 'bootstrap',
    "vue-i18n": 'vue-i18n',
    "font-awesome": 'font-awesome'
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
