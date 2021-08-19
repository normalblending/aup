const { resolve } = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
    mode: 'development',
    devtool: 'source-map',
    entry: './app/index.tsx',
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, env && env.output || 'build')
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude: [/node_modules/],
            loader: "ts-loader"
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'img',
                        outputPath: 'img',
                        useRelativePath: true
                    },
                },
            ],
        }, ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: __dirname + '/app/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
    ],
});
