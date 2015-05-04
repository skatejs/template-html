(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../api/wrapped'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../api/wrapped'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.wrapped);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _apiWrapped) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _wrapped = _interopRequire(_apiWrapped);

  module.exports = {
    get: function get() {
      return this.__node.textContent;
    },

    set: function set(textContent) {
      if (!_wrapped(this)) {
        return this.__node.textContent = textContent;
      }

      var acceptsTextContent;
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;

      // Removes all nodes (including default content).
      this.innerHTML = '';

      // Find the first content node without a selector.
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];

        if (!contentNode.selector) {
          acceptsTextContent = contentNode;
          break;
        }
      }

      // There may be no content nodes that accept text content.
      if (acceptsTextContent) {
        if (textContent) {
          _content.removeDefault(acceptsTextContent);
          acceptsTextContent.container.insertBefore(document.createTextNode(textContent), acceptsTextContent.endNode);
        } else {
          _content.addDefault(acceptsTextContent);
        }
      }
    }
  };
});