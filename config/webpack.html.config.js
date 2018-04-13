import HtmlWebpackPlugin from 'html-webpack-plugin';

export function getPlugins(env) {
	return [
		createPagePlugin('html/index.hbs', ['libs', 'index'], env),
		//createPagePlugin('html/playground.hbs', ['libs', 'playground'], env, { options: { compressBanner: true } }),
		//createPagePlugin('html/resume.hbs', [], env, { options: { compressBanner: true } })
	];
}

function createEnvironmentLink(link, env) {
	if (!env.isProduction) {
		return link;
	}

	if (/.html$/.test(link)) {
		return link.substring(0, link.lastIndexOf('.'));
	}
}

function getPageConfig(env, {
	compressBanner = false
} = {}) {
	return {
		compressBanner,
		includeDevServer: env.isDevelopment,
		links: {
			'home': '/',
			// 'blog': '//blog.chrisloughney.com',
			// 'playground': createEnvironmentLink('/playground.html', env),
			// 'resume': createEnvironmentLink('/resume.html', env)
		}
	};
}

function createPagePlugin(template, chunks, env, {
	title = 'Carputer',
	filename,
	options
} = {}) {
	if (!filename) {
		let matches = template.match(/(.*\/)?(.*)\.hbs$/);
		filename = matches.pop() + '.html';
	}

	return new HtmlWebpackPlugin({
		title,
		filename,
		template,
		chunks,
		chunksSortMode: 'dependency',
		pageOptions: getPageConfig(env, options)
	});
}
