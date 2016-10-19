const path = require('path');

const autoprefixer = require('autoprefixer');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

//=========================================================
//  VARS
//---------------------------------------------------------


//=========================================================
//  LOADERS
//---------------------------------------------------------
const rules = {
  cssStyles: { 
    test: /\.css$/, 
    loader: ['style-loader', 'css-loader']
  },
  componentStyles: {
    test: /\.scss$/,
    loader: 'raw!postcss!sass'
  },
  javascript: {
    test: /\.js$/,
    loader: ['babel-loader'],
    exclude: [/node_modules/, /src/]
  },
  typescript: {
    test: /\.ts$/,
    loader: ['awesome-typescript-loader', 'angular2-template-loader'],
    exclude: /node_modules/
  },
  html: {
    test: /\.html$/,
    loader: ['html-loader']
  },
  fontFile: { 
    test: /\.(ttf|otf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loaders: ['file-loader'] 
  },
  fontUrl: { 
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
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
    rules.javascript,
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
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    path.resolve('src')
  )
];

config.devtool = 'inline-source-map';
