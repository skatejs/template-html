module.exports = function (grunt) {
  grunt.registerTask('dist', 'Creates the dist files.', [
    'clean',
    'karma:cli',
    'requirejs'
  ]);
};
