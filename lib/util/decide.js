(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './content', '../api/wrapped'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./content'), require('../api/wrapped'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.wrapped);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _content, _apiWrapped) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content2 = _interopRequire(_content);

  var _wrapped = _interopRequire(_apiWrapped);

  module.exports = function (fnWrapped, fnUnwrapped) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var node = this.__element;
      var opts = {
        args: args,
        content: _content2.get(node),
        node: node
      };
      return _wrapped(this) ? fnWrapped.call(this, opts) : fnUnwrapped.call(this, opts);
    };
  };
});