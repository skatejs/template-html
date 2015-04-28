(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/call', '../util/content', '../util/find'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/call'), require('../util/content'), require('../util/find'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.call, global.content, global.find);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilCall, _utilContent, _utilFind) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _call = _interopRequire(_utilCall);

  var _content = _interopRequire(_utilContent);

  var _find = _interopRequire(_utilFind);

  module.exports = {
    value: function value(node) {
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;

      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;

        [].slice.call(fragChildNodes).forEach((function (node) {
          this.appendChild(node);
        }).bind(this));

        return this;
      }

      for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var selector = contentNode.selector;

        if (!selector || _find.matches(node, selector)) {
          _content.removeDefault(contentNode);
          _call(contentNode.endNode.parentNode, 'insertBefore')(node, contentNode.endNode);
          break;
        }
      }

      return this;
    }
  };
});