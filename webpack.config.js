const webpack = require('webpack');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {webpack.Configuration} */
module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    resolve: {
        extensions: ['.js', '.ts'],
    },
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        port: 6969,
    },
    output: {
        path: resolve('./dist'),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
        }, {
            test: /\.(sass|scss)$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};
