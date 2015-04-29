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

  var nodeTextContent = Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent');

  module.exports = {
    // Fixed for same reason as innerHTML.
    get: function get() {
      var textContent = '';
      var childNodes = this.childNodes;
      var childNodesLength = this.childNodes.length;

      for (var a = 0; a < childNodesLength; a++) {
        var childNode = childNodes[a];
        var nodeType = childNode.nodeType;

        if (nodeType === 1 || nodeType === 3) {
          textContent += childNode.textContent;
        }
      }

      return textContent;
    },

    // Fixed for same reason as innerHTML.
    set: function set(text) {
      if (nodeTextContent && nodeTextContent.set) {
        nodeTextContent.set.call(this, text);
        return;
      }

      this.appendChild(document.createTextNode(text));
    }
  };
});