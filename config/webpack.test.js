const path = require('path');

const autoprefixer = require('autoprefixer');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const WatchIgnorePlugin = require('webpack/lib/WatchIgnorePlugin');

//=========================================================
//  LOADERS
//---------------------------------------------------------
const rules = {
    cssStyles: {
        test: /\.css$/,
        use: 'null'
    },
    componentStyles: {
        test: /\.scss$/,
        use: ['raw-loader', 'sass-loader']
    },
    typescript: {
        test: /\.ts$/,
        use: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: /node_modules/
    },
    html: {
        test: /\.html$/,
        use: ['html-loader']
    },
    fontFile: {
        test: /\.(ttf|otf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'null'
    },
    fontUrl: {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'null'
    }
};

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {};

config.resolve = {
    extensions: ['.ts', '.js', '.css', '.scss'],
    modules: [
        path.resolve('.'),
        'node_modules'
    ],
    alias: {
        lodash: 'node_modules/lodash/lodash.min'
    }
};

config.module = {
    rules: [
        rules.typescript,
        rules.cssStyles,
        rules.componentStyles,
        rules.html,
        rules.fontFile,
        rules.fontUrl
    ]
};

config.plugins = [
    new ProvidePlugin({
        _: 'lodash'
    }),
    new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve('src')
    ),
    new WatchIgnorePlugin([
        path.resolve('dist'),
        path.resolve('dts')
    ])
];

config.devtool = 'inline-source-map';
