const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const pages = fs.readdirSync('./src/pug/pages')
    .filter(page => page.endsWith('.pug'))
    .map(page => page.split('.')[0])

module.exports = {
    entry: {
        script: './src/script.js',
        style: './src/sass/main.sass'
    },

    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: '[name].js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.(sass|scss|css)$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'sass-loader'
                }]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.data\.js$/,
            },
        ]
    },

    plugins: pages.map(page => new HtmlWebpackPlugin({
        template: `src/pug/pages/${page}.pug`,
        filename: `${page}.html`,
        chunks: ['global', 'index'],
        minify: {
            removeComments: true
        }
    })).concat([
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}]
            }
        }),
        new CopyWebpackPlugin([{
            from: 'src/static',
            to: 'static'
        }])
    ]),

    devServer: {
        inline: true,
        stats: {colors: true},
        historyApiFallback: {
            disableDotRule: true,
            rewrites: pages.map(page => ({
                from: new RegExp(`^\/${page}$`), to: `/${page}.html`
            }))
        },
    }
}
