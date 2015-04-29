(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/call', '../util/content'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/call'), require('../util/content'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.call, global.content);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilCall, _utilContent) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _call = _interopRequire(_utilCall);

  var _content = _interopRequire(_utilContent);

  module.exports = {
    value: function value(newChild, oldChild) {
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;

      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];

        if (contentNode.container === oldChild.parentNode) {
          _call(contentNode.container, 'replaceChild')(newChild, oldChild);
          break;
        }
      }

      return this;
    }
  };
});