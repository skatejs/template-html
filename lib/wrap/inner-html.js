(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/call', '../util/content', '../util/find', '../util/fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/call'), require('../util/content'), require('../util/find'), require('../util/fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.call, global.content, global.find, global.fragment);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilCall, _utilContent, _utilFind, _utilFragment) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _call = _interopRequire(_utilCall);

  var _content = _interopRequire(_utilContent);

  var _find = _interopRequire(_utilFind);

  var _fragment = _interopRequire(_utilFragment);

  module.exports = {
    get: function get() {
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
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;
      var targetFragment = _fragment.fromString(html);

      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
        var childNodes = _find.between(contentNode.startNode, contentNode.endNode);

        // Remove all nodes (including default content).
        for (var b = 0; b < childNodes.length; b++) {
          var childNode = childNodes[b];
          _call(childNode.parentNode, 'removeChild')(childNode);
        }

        var foundNodes = _find.selector(targetFragment, contentNode.selector);

        // Add any matched nodes from the given HTML.
        for (var c = 0; c < foundNodes.length; c++) {
          _call(contentNode.container, 'insertBefore')(foundNodes[c], contentNode.endNode);
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