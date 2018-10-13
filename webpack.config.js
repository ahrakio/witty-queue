const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');


// Clean configurations
const clean_paths = [
    'dist'
];

const clean_options = {
    watch: true
};

const config = {
    entry: './src/app.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
	stats: {
		chunks: false,
		hash: false,
		version: false,
		timings: false,
		assets: false,
		modules: false,
		reasons: false,
		children: false,
		source: false,
		errors: false,
		errorDetails: false,
		warnings: false,
		publicPath: false,
		builtAt: false,
		entrypoints: false
	},
	output: {
        library: 'bundle',
        filename: 'dist/bundle.js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname)
    },
    target: 'node',
    mode: 'none',
    plugins: [
    	new UglifyJsPlugin()
    ]
};

module.exports = config;
