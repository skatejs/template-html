(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _default = (function () {
    var _class = function _default() {
      _classCallCheck(this, _class);
    };

    _createClass(_class, null, [{
      key: 'get',
      value: function get(element) {
        return element.__skatejs_template_html_content;
      }
    }, {
      key: 'set',
      value: function set(element, content) {
        element.__skatejs_template_html_content = content;
        return this;
      }
    }, {
      key: 'addDefault',
      value: function addDefault(content) {
        var nodes = content.defaultNodes;
        var nodesLen = nodes.length;

        for (var a = 0; a < nodesLen; a++) {
          content.container.insertBefore(nodes[a], content.endNode);
        }

        content.isDefault = true;
      }
    }, {
      key: 'removeDefault',
      value: function removeDefault(content) {
        var nodes = content.defaultNodes;
        var nodesLen = nodes.length;

        for (var a = 0; a < nodesLen; a++) {
          var node = nodes[a];
          node.parentNode.removeChild(node);
        }

        content.isDefault = false;
      }
    }]);

    return _class;
  })();

  module.exports = _default;
});