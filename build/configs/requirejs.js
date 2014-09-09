module.exports = function () {
  'use strict';

  return {
    dist: {
      options: {
        paths: {
          'skate/template/html': 'src/main'
        },
        baseUrl: '.',
        name: 'skate/template/html',
        out: 'dist/skate-template-html.js'
      }
    }
  };
};
