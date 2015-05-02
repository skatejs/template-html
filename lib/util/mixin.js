(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './property'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./property'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.property);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _property) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _property2 = _interopRequire(_property);

  module.exports = function (proto, parent) {
    Object.keys(parent).forEach(function (key) {
      _property2(proto, key, parent[key]);
    });
    return proto;
  };
});