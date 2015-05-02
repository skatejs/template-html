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

  module.exports = function (node) {
    node.__skateTemplateHtmlWrapped = true;

    if (!_content.get(node)) {
      _content.set(node, _content.parse(node));
    }

    return node;
  };
});