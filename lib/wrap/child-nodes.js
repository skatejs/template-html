(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/decide', '../util/query'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/decide'), require('../util/query'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.decide, global.query);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilDecide, _utilQuery) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _decide = _interopRequire(_utilDecide);

  var _query = _interopRequire(_utilQuery);

  module.exports = {
    get: _decide(function (data) {
      return data.content.reduce(function (prev, curr) {
        return prev.concat(curr.isDefault ? [] : _query.between(curr.startNode, curr.endNode).map(function (node) {
          return node.__wrapper;
        }));
      }, []);
    }, function (opts) {
      var nodes = [];
      var chNodes = opts.node.childNodes;
      var chNodesLen = chNodes.length;

      for (var a = 0; a < chNodesLen; a++) {
        nodes.push(chNodes[a].__wrapper);
      }

      return nodes;
    })
  };
});