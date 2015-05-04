(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', './matches'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('./matches'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.matches);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _matches) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _matches2 = _interopRequire(_matches);

  module.exports = {
    value: function value(node) {
      if (!this.__wrapped) {
        return this.__node.appendChild(node);
      }

      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;
      var that = this;

      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;

        [].slice.call(fragChildNodes).forEach(function (node) {
          that.appendChild(node);
        });

        return this;
      }

      for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var selector = contentNode.selector;

        if (!selector || _matches2.value.call(node, selector)) {
          _content.removeDefault(contentNode);
          contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
          break;
        }
      }

      return this;
    }
  };
});