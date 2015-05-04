(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/content', '../util/query'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/content'), require('../util/query'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.query);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _utilQuery) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _query = _interopRequire(_utilQuery);

  function wrapped(that) {
    return _content.get(that).reduce(function (prev, curr) {
      return prev.concat(curr.isDefault ? [] : _query.between(curr.startNode, curr.endNode).map(function (node) {
        return node.__wrapper;
      }));
    }, []);
  }

  function unwrapped(that) {
    var nodes = [];
    var chNodes = that.__node.childNodes;
    var chNodesLen = chNodes.length;

    for (var a = 0; a < chNodesLen; a++) {
      nodes.push(chNodes[a].__wrapper);
    }

    return nodes;
  }

  module.exports = {
    get: function get() {
      return this.__wrapped ? wrapped(this) : unwrapped(this);
    }
  };
});