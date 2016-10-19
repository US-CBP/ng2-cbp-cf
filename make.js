// var pkg = require('./package.json');
// var path = require('path');
// var name = pkg.name;

var Builder = require('systemjs-builder');
var builder = new Builder();
var config = {
  baseURL: '.',
  transpiler: 'typescript',
  typescriptOptions: {
    module: 'cjs'
  },
  map: {
    typescript: './node_modules/typescript/lib/typescript.js',
    '@angular': './node_modules/@angular',
    rxjs: './node_modules/rxjs',
    lodash: './node_modules/lodash/*',
    'jquery': './node_modules/jquery/dist/jquery.min.js',
    'jquery.inputmask': './node_modules/jquery.inputmask/dist/jquery.inputmask.js'
  },
  paths: {
    '*': '*.js'
  },
  meta: {
    './node_modules/@angular/*': { build: false },
    './node_modules/rxjs/*': { build: false },
    './node_modules/lodash/*': { build: false}
  }
};

builder.config(config);
