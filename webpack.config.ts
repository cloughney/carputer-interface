import * as path from 'path';
import * as webpack from 'webpack';

function configure(env: any, args: any): webpack.Configuration {
    let config: webpack.Configuration = {
		// TODO split config files for env
		mode: 'development',
		devtool: 'inline-source-map',

        entry: {
			app: [
				'./src/index'
			],
			libs: [
				'react',
				'react-dom',
				'react-router-dom'
			]
		},

        output: {
            path: path.resolve(__dirname, 'wwwroot/dist'),
			publicPath: '/dist/',
            filename: '[name].js',
            chunkFilename: '[name].js'
        },

        module: {
            rules: [
				{
					test: /\.tsx?$/,
					exclude: [path.resolve('node_modules')],
					use: 'ts-loader'
				},
                {
                    test: /\.html$/,
                    use: 'html-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
				},
				{
					test: /\.scss$/,
					exclude: [path.resolve('node_modules')],
					use: [{
						loader: 'css-loader',
						options: { minimize: true, sourceMap: true }
					}, {
						loader: 'sass-loader',
						options: { includePaths: ['./node_modules'] }
					}]
				}, {
					test: /\.hbs$/,
					exclude: [path.resolve('node_modules')],
					use: 'handlebars-loader'
				}
            ]
        },

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.html'],
			modules: [ 'node_modules', path.resolve('src') ]
		},

        plugins: [
			
        ],

        // devServer: {
        //     stats: 'errors-only'
        // }
    };

    return config;
}

export default configure;
