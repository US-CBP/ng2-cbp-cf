module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [ ],

    files: [
        './config/karma.entry.js'//,
        //{pattern: './src/**/*.html', watched: true, included: true, served: true}
    ],

    preprocessors: {
      './config/karma.entry.js': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.test'),

    webpackServer: {
      noInfo: true
    },

    webpackMiddleware: {
        stats: 'minimal'
    },

    coverageReporter: {
        dir : 'coverage/',
        reporters: [
            { type: 'text-summary' },
            { type: 'json' },
            { type: 'html' }
        ]
    },

    reporters: ['progress'],

    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: false,

    browsers: ['Chrome']
  });
};
