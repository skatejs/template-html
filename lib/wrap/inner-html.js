(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../util/decide', '../util/query', '../util/fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../util/decide'), require('../util/query'), require('../util/fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.decide, global.query, global.fragment);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _utilDecide, _utilQuery, _utilFragment) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _decide = _interopRequire(_utilDecide);

  var _query = _interopRequire(_utilQuery);

  var _fragment = _interopRequire(_utilFragment);

  module.exports = {
    get: _decide(function () {
      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;

      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += childNode.outerHTML || childNode.textContent;
      }

      return html;
    }, function (data) {
      return data.node.innerHTML;
    }),

    set: _decide(function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var html = data.args[0];
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
    }, function (data) {
      data.node.innerHTML = data.args[0];
    })
  };
});