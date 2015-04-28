'use strict';

var elProto = window.HTMLElement.prototype;
var matchesSelector = (
  elProto.matches ||
  elProto.msMatchesSelector ||
  elProto.webkitMatchesSelector ||
  elProto.mozMatchesSelector ||
  elProto.oMatchesSelector
);

export default {
  between: function (startNode, endNode) {
    var nodes = [];
    var nextNode = startNode.nextSibling;

    while (nextNode !== endNode) {
      nodes.push(nextNode);
      nextNode = nextNode.nextSibling;
    }

    return nodes;
  },

  matches: function (node, selector) {
    return matchesSelector.call(node, selector);
  },

  selector: function (sourceNode, selector) {
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
  }
};
