module.exports = function () {
  'use strict';

  var glob = require('glob');
  var srcFiles = glob.sync('src/*.js');
  var allFiles = srcFiles.map(function (item) {
      return '../' + item;
    });

  return {
    dist: {
      options: {
        baseUrl: 'src',
        dir: 'dist',
        modules: [{
          name: 'template-html',
          create: true,
          include: allFiles,
          exclude: [
            'less',
            'less-builder',
            'normalize'
          ]
        }],
        optimize: 'none',
        optimizeCss: 'none',

        packages: [{
          location: 'require-cs',
          main: 'cs',
          name: 'cs'
        }, {
          main: 'index',
          name: 'coffee-script'
        }],

        // Using `map:` doesn't work like they say it should.
        // Instead it borks the relative URL.
        paths: {
          less: '../bower_components/require-less/less',
          'less-builder': '../bower_components/require-less/less-builder',
          normalize: '../bower_components/require-less/normalize'
        },
        removeCombined: true,

        // Can't get build working with this on, so has to be included with the JS for now.
        separateCSS: false,
        skipDirOptimize: true,
        skipModuleInsertion: true,
        stubModules: [
          'less',
          'less-builder',
          'normalize'
        ]
      }
    }
  };
};
