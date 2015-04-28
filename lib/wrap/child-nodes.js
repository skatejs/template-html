(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../util/find'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../util/find'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.find);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _utilFind) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _find = _interopRequire(_utilFind);

  module.exports = {
    get: function get() {
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;
      var nodes = [];

      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];

        if (contentNode.isDefault) {
          continue;
        }

        nodes = nodes.concat(_find.between(contentNode.startNode, contentNode.endNode));
      }

      return nodes;
    }
  };
});