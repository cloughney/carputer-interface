require('babel-core/register');

const path = require('path');

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '.',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [ 'test/setupTests.ts' ],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: { 'test/setupTests.ts': ['webpack', 'sourcemap'] },

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: 1,

		webpack: {
			output: {
				path: path.resolve('dist'),
				filename: '[name].js'
			},

			resolve: {
				extensions: ['.ts', '.tsx', '.js'],
				modules: [ path.resolve('src'), path.resolve('test'), 'node_modules' ]
			},

			module: {
				rules: [{
					test: /\.tsx?$/,
					exclude: [path.resolve('node_modules')],
					use: 'awesome-typescript-loader'
				}, {
					test: /\.css$/,
					exclude: [path.resolve('node_modules')],
					use: ['style-loader', 'css-loader']
				}, {
					test: /\.scss$/,
					exclude: [path.resolve('node_modules')],
					use: ['style-loader', 'css-loader', 'sass-loader']
				}]
			},

			externals: {
				'react/addons': 'react',
				'react/lib/ExecutionEnvironment': 'react',
				'react/lib/ReactContext': 'react'
			},

			devtool: 'inline-source-map'
		},

		// https://github.com/webpack-contrib/karma-webpack/issues/188
		mime: {
			'text/x-typescript': ['ts','tsx']
		}
	})
}
