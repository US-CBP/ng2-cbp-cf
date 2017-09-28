const path = require('path');
const autoprefixer = require('autoprefixer');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const WatchIgnorePlugin = require('webpack/lib/WatchIgnorePlugin');

//=========================================================
//  VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_DEVELOPMENT = NODE_ENV === 'development';

//=========================================================
//  LOADERS
//---------------------------------------------------------
const rules = {
    cssStyles: {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: 'raw-loader', use: 'css-loader' })
    },
    componentStyles: {
        test: /\.scss$/,
        use: ['raw-loader', 'sass-loader']
    },
    javascript: {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
    },
    typescript: {
        test: /\.ts$/,
        use: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: /node_modules/
    },
    html: {
        test: /\.html$/,
        use: ['html-loader?-minimize']
    },
    fontFile: {
        test: /\.(ttf|otf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader']
    },
    fontUrl: {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader?limit=10000&mimetype=application/font-woff']
    },
    imagesFile: {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
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
        path.join(__dirname, 'node_modules'),
        'node_modules'
    ],
    alias: {
    }
};

config.module = {
    rules: [
        rules.javascript,
        rules.typescript,
        rules.cssStyles,
        rules.componentStyles,
        rules.html,
        rules.fontFile,
        rules.fontUrl,
        rules.imagesFile
    ]
};

config.plugins = [
    new ExtractTextPlugin('[name].css'),
    new ProvidePlugin({
        _: 'lodash',
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
        'jquery.inputmask': 'jquery.inputmask'
    }),
    new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new LoaderOptionsPlugin({
        debug: false,
        minimize: true,
        options: {
            postcss: [
                autoprefixer({ browsers: ['last 3 versions'] })
            ],
            resolve: {},
            sassLoader: {
                outputStyle: 'compressed',
                precision: 10,
                sourceComments: false
            }
        }
    }),
    new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve('src')
    ),
    new WebpackShellPlugin({ onBuildEnd: ['npm run tsc'], dev: false })
];

config.entry = {
    'ng2-cbp-cf': './ng2-cbp-cf.ts'
};

config.output = {
    libraryTarget: 'umd',
    library: 'ng2-cbp-cf',
    path: path.resolve('./dist'),
    filename: '[name].js'
};

config.externals = {
    '@angular/core': '@angular/core',
    '@angular/platform-browser': '@angular/platform-browser',
    '@angular/forms': '@angular/forms',
    '@angular/router': '@angular/router',
    '@angular/http': '@angular/http',
    '@angular/common': '@angular/common',
    '@types/lodash': '@types/lodash',
    '@angular/platform-browser-dynamic': '@angular/platform-browser-dynamic',
    'rxjs': 'rxjs',
    'rxjs/add/operator/toPromise': 'rxjs/add/operator/toPromise',
    'lodash': 'lodash',
    'moment/moment': 'moment/moment'
};

//=====================================
//  DEVELOPMENT
//-------------------------------------
if(ENV_DEVELOPMENT) {
    config.devtool = 'inline-source-map';
    config.plugins.push(new ProgressPlugin());
    config.plugins.push(
        new WatchIgnorePlugin([
            path.resolve('dist'),
            path.resolve('dts')
        ])
    );
}

//=====================================
//  PRODUCTION
//-------------------------------------
if(ENV_PRODUCTION) {
    config.devtool = 'hidden-source-map';

    config.plugins.push(
        new UglifyJsPlugin({
            comments: false,
            compress: {
                dead_code: true, // eslint-disable-line camelcase
                screw_ie8: true, // eslint-disable-line camelcase
                unused: true,
                warnings: false
            },
            mangle: {
                screw_ie8: true // eslint-disable-line camelcase
            }
        })
    );
}
