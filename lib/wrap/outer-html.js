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

  module.exports = {
    get: function get() {
      var name = this.tagName.toLowerCase();
      var html = '<' + name;
      var attrs = this.attributes;

      if (attrs) {
        var attrsLength = attrs.length;

        for (var a = 0; a < attrsLength; a++) {
          var attr = attrs[a];
          html += ' ' + attr.nodeName + '="' + attr.nodeValue + '"';
        }
      }

      html += '>';
      html += this.innerHTML;
      html += '</' + name + '>';

      return html;
    }
  };
});