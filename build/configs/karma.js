module.exports = function (grunt) {
  var browsers = grunt.option('browsers');

  if (browsers) {
    browsers = browsers.split(',');
  } else {
    browsers = ['Firefox'];
  }

  return {
    options: {
      hostname: grunt.option('host') || 'localhost',
      port: grunt.option('port') || '9876',
      browsers: browsers,
      files: [
        // Load in script tags.
        { pattern: 'test/lib/polyfills.js', included: true },
        { pattern: 'test/*.js', included: true },

        // Register for AMD loader.
        { pattern: 'bower_components/**/*.js', included: false },
        { pattern: 'src/*.js', included: false },
        { pattern: 'test/**/*.js', included: false },
        { pattern: 'test/lib/helpers.js', included: false }
      ],
      frameworks: [
        'requirejs',
        'mocha',
        'chai'
      ],
      plugins: [
        'karma-chai',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-mocha',
        'karma-phantomjs-launcher',
        'karma-requirejs'
      ],
      singleRun: !grunt.option('watch')
    },
    cli: {},
    http: {
      singleRun: false
    }
  };
};
