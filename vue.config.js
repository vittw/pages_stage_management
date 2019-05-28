const path = require('path')
//const vuxLoader = require('vux-loader')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	//	configureWebpack: config => {
	//  vuxLoader.merge(config, {
	//	      plugins: ['vux-ui', 'duplicate-style']
	//	    })
	//	},
	// 部署应用时的基本 URL
	baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
	// build时构建文件的目录 构建时传入 --no-clean 可关闭该行为
	outputDir: 'dist',
	// build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
	assetsDir: 'static',
	// 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
	//indexPath: 'index.html',
	lintOnSave: false, //去除eslint语法限制

	// 默认在生成的静态资源文件名中包含hash以控制缓存
	filenameHashing: true,
	//	entry: {
	//		app: './src/pages/index/main.js'
	//	},
	configureWebpack: config => {
		//开启此处会造成Chrome中无法调试Vue,如果是正式环境发布，需要恢复
		// externals: {
		// 	"vue": "Vue",
		// 	"vuex": "Vuex",
		// 	"vue-router": "VueRouter",
		// 	"iview": "iview",
		// },
		if (process.env.NODE_ENV == 'development') {
			return {
				devtool: 'source-map',//源代码映射，方便在chrome-Source中找到指定文件，进行调试
				mode: 'development',
			}
		}
	},
	//多页面设置
	pages: {
		index: {
			entry: 'src/pages/index/main.js',
			template: 'public/index.html',
			filename: 'index.html',
			// 当使用 title 选项时，
			// template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'index',
			// 在这个页面中包含的块，默认情况下会包含
			// 提取出来的通用 chunk 和 vendor chunk。
			// chunks: ['chunk-vendors', 'chunk-common', 'index']
		},
		// 当使用只有入口的字符串格式时，
		// 模板会被推导为 `public/subpage.html`
		// 并且如果找不到的话，就回退到 `public/index.html`。
		// 输出文件名会被推导为 `subpage.html`。
		basicInfo: {
			entry: 'src/pages/basicInfo/main.js',
			template: 'public/basicInfo.html',
			filename: 'basicInfo.html',
			title: 'basicInfo'
		},
		dataCenter: {
			entry: 'src/pages/dataCenter/main.js',
			template: 'public/dataCenter.html',
			filename: 'dataCenter.html',
			title: 'dataCenter'
		},
		callCenter: {
			entry: 'src/pages/callCenter/main.js',
			template: 'public/callCenter.html',
			filename: 'callCenter.html',
			title: 'callCenter'
		},
		callCenterOld: {
			entry: 'src/pages/callCenterOld/main.js',
			template: 'public/callCenterOld.html',
			filename: 'callCenterOld.html',
			title: 'callCenterOld'
		},

	},
	//配置 webpack-dev-server 行为
	devServer: {
		open: true, //运行项目后自动打开浏览器
		//      open: process.platform === 'darwin',
		//     host: '127.0.0.1',
		host: '127.0.0.1', //设置ip地址
		port: 9099, //设置端口号
		https: false,
		//      hotOnly: false,
		proxy: {
			'/xxx': {
				target: 'http://localhost:58367',
				ws: true,
				changeOrigin: true
			},
			'/foo': {
				target: '<other_url>'
			}
		}, // 设置代理
		//      before: app => {}

	},
	//// css相关配置
	css: {
		extract: true,
		sourceMap: false,
		loaderOptions: {
			less: {
				test: /\.less$/,
				loader: "style-loader!css-loader!less-loader",
			}
		},
		modules: false
	},
	// chainWebpack
	//	chainWebpack: config => {
	//		//设置路径别名
	//		config.resolve.alias
	//			.set('styles', resolve('src/assets/styles'))
	//			.set('@', resolve('src'))
	//			.set('components', resolve('src/components'))
	//	},
}