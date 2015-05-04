(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../util/query', '../util/fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../util/query'), require('../util/fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.query, global.fragment);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _utilQuery, _utilFragment) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _query = _interopRequire(_utilQuery);

  var _fragment = _interopRequire(_utilFragment);

  module.exports = {
    get: function get() {
      if (!this.__wrapped) {
        return this.__node.innerHTML;
      }

      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;

      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += childNode.outerHTML || childNode.textContent;
      }

      return html;
    },

    set: function set(html) {
      if (!this.__wrapped) {
        this.__node.innerHTML = html;
        return;
      }

      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;
      var targetFragment = _fragment.fromString(html);

      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
        var childNodes = _query.between(contentNode.startNode, contentNode.endNode);

        // Remove all nodes (including default content).
        for (var b = 0; b < childNodes.length; b++) {
          var childNode = childNodes[b];
          childNode.parentNode.removeChild(childNode);
        }

        var foundNodes = _query.selector(targetFragment, contentNode.selector);

        // Add any matched nodes from the given HTML.
        for (var c = 0; c < foundNodes.length; c++) {
          var node = foundNodes[c];
          contentNode.container.insertBefore(node, contentNode.endNode);
          this.childNodes.push(node);
        }

        // If no nodes were found, set the default content.
        if (foundNodes.length) {
          _content.removeDefault(contentNode);
        } else {
          _content.addDefault(contentNode);
        }
      }
    }
  };
});