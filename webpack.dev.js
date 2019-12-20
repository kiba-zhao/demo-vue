const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common,{
	mode:'development',
	devtool:'inline-source-map',
	entry:'./src/demo.js',
	devServer:{
		contentBase: './dist',
		hot:true
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin()
	]
});
