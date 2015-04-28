(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  module.exports = {
    value: function value(childNode) {
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;
      var removed = false;

      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];

        if (contentNode.container === childNode.parentNode) {
          contentNode.container.removeChild(childNode);
          removed = true;
          break;
        }

        if (contentNode.startNode.nextSibling === contentNode.endNode) {
          _content.addDefault(contentNode);
        }
      }

      if (!removed) {
        throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
      }

      return childNode;
    }
  };
});