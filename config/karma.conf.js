module.exports = config => {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        // list of files to exclude
        exclude: [
            './dist/**/*',
            './dts/**/*'
        ],

        files: [
            { pattern: './config/karma.entry.js', watched: false }
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
            dir: 'coverage/',
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
