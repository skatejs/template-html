(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/fragment', '../util/html-of'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/fragment'), require('../util/html-of'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.fragment, global.htmlOf);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilFragment, _utilHtmlOf) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _fragment = _interopRequire(_utilFragment);

  var _htmlOf = _interopRequire(_utilHtmlOf);

  var elementInnerHTML = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML');

  module.exports = {
    // Chrome doesn't report innerHTML properly using the original getter once
    // it's been overridden. This ensures that it uses the proper means to do so.
    // This may be because of some internal cache or something but it just doesn't
    // work.
    get: function get() {
      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;

      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += _htmlOf(childNode);
      }

      return html;
    },

    // Webkit doesn't return anything when Object.getOwnPropertyDescriptor() is
    // called to get built-in accessors so we've got to fully re-implement
    // innerHTML if we can't get an accessor for it.
    set: function set(html) {
      if (elementInnerHTML && elementInnerHTML.set) {
        elementInnerHTML.set.call(this, html);
        return;
      }

      var frag = _fragment.fromString(html);
      this.appendChild(frag);
    }
  };
});