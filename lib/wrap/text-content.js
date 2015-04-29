(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/call', '../util/content', '../fix/text-content'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/call'), require('../util/content'), require('../fix/text-content'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.call, global.content, global.fixTextContent);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilCall, _utilContent, _fixTextContent) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _call = _interopRequire(_utilCall);

  var _content = _interopRequire(_utilContent);

  var _fixTextContent2 = _interopRequire(_fixTextContent);

  module.exports = {
    get: _fixTextContent2.get,
    set: function set(textContent) {
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
          _call(acceptsTextContent.container, 'insertBefore')(document.createTextNode(textContent), acceptsTextContent.endNode);
        } else {
          _content.addDefault(acceptsTextContent);
        }
      }
    }
  };
});