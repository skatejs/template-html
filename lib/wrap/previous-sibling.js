(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/decide'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/decide'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.decide);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilDecide) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _decide = _interopRequire(_utilDecide);

  module.exports = {
    get: _decide(function (data) {
      return data.node.previousSibling;
    }, function (data) {
      return data.node.previousSibling;
    })
  };
});