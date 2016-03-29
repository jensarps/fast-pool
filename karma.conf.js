/* global module:false */
module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon'],

    reporters: ['dots', 'progress'],

    browsers: ['PhantomJS'],

    singleRun: true,

    files: [
      'dist/fast-pool.min.js',
      'test/**/*spec.js'
    ]
  });
};
