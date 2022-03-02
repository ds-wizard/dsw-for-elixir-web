const fs = require('fs')
const merge = require('webpack-merge')
const common = require('./webpack.config')
const webpack = require('webpack')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const RobotstxtPlugin = require('robotstxt-webpack-plugin')

const paths = fs.readdirSync('./src/pug/pages')
    .filter(page => page.endsWith('.pug'))
    .map(page => {
        const pageName = page.split('.')[0]
        const stats = fs.statSync(`./src/pug/pages/${pageName}.pug`)
        return {
            path: `/${pageName}`,
            lastmod: stats.mtime.toUTCString()
        }
    })


module.exports = merge(common, {
    mode: 'production',

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new SitemapPlugin({
            base: 'https://elixir-ds-wizard.org',
            paths
        }),
        new RobotstxtPlugin({
            sitemap: 'https://elixir-ds-wizard.org/sitemap.xml',
            host: 'https://elixir-ds-wizard.org'
        })
    ]
})
