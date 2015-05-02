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

  module.exports = htmlOf;
  var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  function htmlOf(node) {
    var attrs;
    var attrsLen;
    var childNodes;
    var childNodesLen;
    var html;
    var tagName;

    if (node.nodeType === 3) {
      return node.textContent;
    }

    if (node.nodeType === 8) {
      return '<!--' + node.textContent + '-->';
    }

    attrs = node.attributes;
    attrsLen = attrs.length;
    childNodes = node.childNodes;
    childNodesLen = childNodes.length;
    tagName = node.nodeName.toLowerCase();
    html = '<' + tagName;

    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a];
      var attrName = attr.nodeName;
      var attrValue = attr.value || attr.nodeValue;
      html += ' ' + attrName;
      if (typeof attrValue === 'string') {
        html += '="' + attrValue + '"';
      }
    }

    html += '>';

    if (voidElements.indexOf(tagName) === -1) {
      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += htmlOf(childNode);
      }

      html += '</' + tagName + '>';
    }

    return html;
  }
});