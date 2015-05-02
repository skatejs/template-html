(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../util/decide'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../util/decide'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.decide);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _utilDecide) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _decide = _interopRequire(_utilDecide);

  module.exports = {
    value: _decide(function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var node = data.args[0];
      var that = this;

      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;

        [].slice.call(fragChildNodes).forEach(function (node) {
          that.appendChild(node);
        });

        return this;
      }

      for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var selector = contentNode.selector;

        if (!selector || node.__wrapper.matches(selector)) {
          _content.removeDefault(contentNode);
          contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
          break;
        }
      }

      return this;
    }, function (data) {
      return data.node.appendChild(data.args[0]);
    })
  };
});