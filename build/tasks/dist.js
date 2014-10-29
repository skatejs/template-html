module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('dist', 'Creates the dist files.', [
    'clean:dist',
    'karma:cli',
    'concat:dist',
    'uglify:dist'
  ]);
};
