(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../util/decide', '../util/readonly'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../util/decide'), require('../util/readonly'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.decide, global.readonly);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _utilDecide, _utilReadonly) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _decide = _interopRequire(_utilDecide);

  var _readonly = _interopRequire(_utilReadonly);

  module.exports = {
    value: _decide(function (data) {
      var childNode = data.args[0].__node;
      var contentNodes = _content.get(this);
      var contentNodesLen = contentNodes.length;
      var removed = false;

      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];

        if (contentNode.container === childNode.parentNode) {
          contentNode.container.removeChild(childNode);
          removed = true;
        }

        if (contentNode.startNode.nextSibling === contentNode.endNode) {
          _content.addDefault(contentNode);
        }

        if (removed) {
          break;
        }
      }

      if (!removed) {
        throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
      }

      return childNode;
    }, function (data) {
      return this.__node.removeChild(data.args[0]);
    })
  };
});