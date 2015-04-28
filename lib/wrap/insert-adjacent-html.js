(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.fragment);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilFragment) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _fragment = _interopRequire(_utilFragment);

  module.exports = {
    value: function value(where, html) {
      if (where === 'afterbegin') {
        this.insertBefore(_fragment.fromString(html), this.childNodes[0]);
      } else if (where === 'beforeend') {
        this.appendChild(_fragment.fromString(html));
      } else {
        this.__insertAdjacentHTML(where, html);
      }

      return this;
    }
  };
});