(function (factory) {
  'use strict';

  // Global.
  window.templateReact = factory();

  // AMD.
  if (typeof define === 'function') {
    define(function () {
      return factory();
    });
  }

  // CommonJS.
  if (typeof module === 'object') {
    module.exports = factory();
  }
}(function () {
  'use strict';

  return {};
}));
