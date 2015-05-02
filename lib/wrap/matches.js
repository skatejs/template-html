(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var elementProto = window.HTMLElement.prototype;
  var matchesSelector = elementProto.matches || elementProto.msMatchesSelector || elementProto.webkitMatchesSelector || elementProto.mozMatchesSelector || elementProto.oMatchesSelector;

  module.exports = {
    value: function value(selector) {
      return this.nodeType === 1 && matchesSelector.call(this.__element, selector);
    }
  };
});