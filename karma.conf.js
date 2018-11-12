const webpackConfig = require('./webpack.config.js');

['entry', 'output', 'optimization'].forEach(key => {
    delete webpackConfig[key];
});

module.exports = function(config) {

    config.set({

        frameworks: ['mocha'],

        files: [
          'spec/**/*spec.js'
        ],

        preprocessors: {
            'spec/**/*spec.js': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        reporters: ['spec', 'coverage'],

        coverageReporter: {
            dir: './coverage',
            reporters: [
                {type: 'lcov', subdir: '.'},
                {type: 'text-summary'}
            ]
        },

        browsers: ['ChromeHeadless']

    });

};