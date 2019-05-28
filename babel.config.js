const plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}

module.exports = {
	presets: [
		'@vue/app'
	],
	plugins,
	env: {
		"test": {
			"presets": ["env", "stage-2"],
			"plugins": ["transform-vue-jsx",
				"transform-es2015-modules-commonjs",
				"dynamic-import-node",
				["import", {
					"libraryName": "iview",
					"libraryDirectory": "src/components"
				}]
			]
		}
	}
}
