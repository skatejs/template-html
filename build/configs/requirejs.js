module.exports = function () {
  'use strict';

  return {
    dist: {
      options: {
        paths: {
          'template/html': 'src/main'
        },
        baseUrl: '.',
        name: 'template/html',
        out: 'dist/template-html.js'
      }
    }
  };
};
