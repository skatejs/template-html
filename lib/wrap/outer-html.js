(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/html-of'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/html-of'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.htmlOf);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilHtmlOf) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _htmlOf = _interopRequire(_utilHtmlOf);

  module.exports = {
    get: function get() {
      return _htmlOf(this);
    },

    set: function set(outerHTML) {
      this.__node.outerHTML = outerHTML;
    }
  };
});