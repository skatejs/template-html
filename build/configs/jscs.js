module.exports = function (grunt) {
  return {
    all: [
      'Gruntfile.js',
      'build/{*,**}.js',
      'src/{*,**}.js',
      'test/{*,**}.js'
    ]
  };
};
