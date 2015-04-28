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
    value: function value(node, referenceNode) {
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;

      // If no reference node is supplied, we append. This also means that we
      // don't need to add / remove any default content because either there
      // aren't any nodes or appendChild will handle it.
      if (!referenceNode) {
        return this.appendChild(node);
      }

      // Handle document fragments.
      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;

        if (fragChildNodes) {
          var fragChildNodesLength = fragChildNodes.length;

          for (var a = 0; a < fragChildNodesLength; a++) {
            this.insertBefore(fragChildNodes[a], referenceNode);
          }
        }

        return this;
      }

      var hasFoundReferenceNode = false;

      // There's no reason to handle default content add / remove because:
      // 1. If no reference node is supplied, appendChild handles it.
      // 2. If a reference node is supplied, there already is content.
      // 3. If a reference node is invalid, an exception is thrown, but also
      //    it's state would not change even if it wasn't.
      mainLoop: for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var betweenNodes = _find.between(contentNode.startNode, contentNode.endNode);
        var betweenNodesLen = betweenNodes.length;

        for (var c = 0; c < betweenNodesLen; c++) {
          var betweenNode = betweenNodes[c];

          if (betweenNode === referenceNode) {
            hasFoundReferenceNode = true;
          }

          if (hasFoundReferenceNode) {
            var selector = contentNode.selector;

            if (!selector || _find.matches(node, selector)) {
              _call(betweenNode.parentNode, 'insertBefore')(node, betweenNode);
              break mainLoop;
            }
          }
        }
      }

      // If no reference node was found as a child node of the element we must
      // throw an error. This works for both no child nodes, or if the
      // reference wasn't found to be a child node.
      if (!hasFoundReferenceNode) {
        throw new Error('DOMException 8: The node before which the new node is to be inserted is not a child of this node.');
      }

      return node;
    }
  };
});