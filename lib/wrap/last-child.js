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
    get: function get() {
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;

      for (var a = contentNodesLen - 1; a > -1; a--) {
        var contentNode = contentNodes[a];

        if (contentNode.isDefault) {
          continue;
        }

        var childNodes = this.childNodes;
        var childNodesLen = childNodes.length;

        return childNodes[childNodesLen - 1];
      }

      return null;
    }
  };
});