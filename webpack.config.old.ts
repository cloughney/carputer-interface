'use strict';

import webpack from 'webpack';
import * as path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import * as project from './package.json';

import env from './config/webpack.env.config';

const plugins = [
	new webpack.LoaderOptionsPlugin({
		debug: env.isDevelopment
	}),
	new ExtractTextPlugin({
		filename: '[name].css',
		allChunks: true,
		disable: !env.isProduction
	}),
	new webpack.ProvidePlugin({
		'regeneratorRuntime': 'regenerator-runtime'
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'libs',
		minChunks: Infinity
	}),
	new HtmlWebpackPlugin({
		title: 'Carputer',
		template: 'html/index.hbs',
		chunksSortMode: 'dependency',
		pageOptions: { includeDevServer: env.isDevelopment }
	})
	// new CopyWebpackPlugin([
	// 	//{ from: 'favicon.ico', to: 'favicon.ico' },
	// 	{ from: '**/images/**/*', ignore: ['node_modules/**/*'] }
	// ])
];

if (env.isProduction) {
	plugins.push.apply(plugins, [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin()
	]);
}

module.exports = {
	entry: {
		'index': [
			'./src/index'
		],
		'libs': [
			'react',
			'react-dom',
			'react-router-dom'
		]
	},
	
	plugins,

	output: {
		path: path.resolve('dist'),
		filename: '[name].js'
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.html'],
		modules: [ path.resolve('src'), 'node_modules' ]
	},

	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: [path.resolve('node_modules')],
			use: 'awesome-typescript-loader'
		}, {
			test: /\.css$/,
			exclude: [path.resolve('node_modules')],
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader'
			})
		}, {
			test: /\.scss$/,
			exclude: [path.resolve('node_modules')],
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader',
					options: {
						minimize: true,
						sourceMap: env.isDevelopment
					}
				}, {
					loader: 'sass-loader',
					options: {
						includePaths: ['./node_modules']
					}
				}]
			})
		}, {
			test: /\.hbs$/,
			exclude: [path.resolve('node_modules')],
			use: 'handlebars-loader'
		}, {
			test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?.*)?$/,
			include: [
				path.resolve('node_modules/bootstrap'),
				path.resolve('node_modules/font-awesome'),
				path.resolve('src')
			],
			use: {
				loader: 'url-loader',
				options: {
					limit: 100000,
					name: '[name].[ext]'
				}
			}
		}]
	},

	devServer: {
		contentBase: 'dist/',
		compress: true,
		noInfo: true,
		inline: true,
		historyApiFallback: true,
		https: true
	}
};
