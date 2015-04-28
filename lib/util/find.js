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

  var elProto = window.HTMLElement.prototype;
  var matchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

  module.exports = {
    between: function between(startNode, endNode) {
      var nodes = [];
      var nextNode = startNode.nextSibling;

      while (nextNode !== endNode) {
        nodes.push(nextNode);
        nextNode = nextNode.nextSibling;
      }

      return nodes;
    },

    matches: function matches(node, selector) {
      return node.nodeType === 1 && matchesSelector.call(node, selector);
    },

    selector: (function (_selector) {
      function selector(_x, _x2) {
        return _selector.apply(this, arguments);
      }

      selector.toString = function () {
        return _selector.toString();
      };

      return selector;
    })(function (sourceNode, selector) {
      if (selector) {
        var found = sourceNode.querySelectorAll(selector);
        var foundLength = found.length;
        var filtered = [];

        for (var a = 0; a < foundLength; a++) {
          var node = found[a];

          if (node.parentNode === sourceNode) {
            filtered.push(node);
          }
        }

        return filtered;
      }

      return [].slice.call(sourceNode.childNodes) || [];
    })
  };
});