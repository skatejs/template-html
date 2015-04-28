'use strict';

import fragment from '../util/fragment';

var elProtoInnerHTML = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML');

function htmlOf (node) {
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
    return `<!--${node.textContent}-->`;
  }

  attrs = node.attributes;
  attrsLen = attrs.length;
  childNodes = node.childNodes;
  childNodesLen = childNodes.length;
  tagName = node.nodeName.toLowerCase();
  html = `<${tagName}`;

  for (let a = 0; a < attrsLen; a++) {
    let attr = attrs[a];
    let attrName = attr.nodeName;
    let attrValue = attr.value || attr.nodeValue;
    html += ` ${attrName}`;
    if (typeof attrValue === 'string') {
      html += `="${attrValue}"`;
    }
  }

  html += '>';

  for (let a = 0; a < childNodesLen; a++) {
    let childNode = childNodes[a];
    html += htmlOf(childNode);
  }

  html += `</${tagName}>`;

  return html;
}

export default {
  // Chrome doesn't report innerHTML properly using the original getter once
  // it's been overridden. This ensures that it uses the proper means to do so.
  // This may be because of some internal cache or something but it just doesn't
  // work.
  get: function () {
    var html = '';
    var childNodes = this.childNodes;
    var childNodesLen = childNodes.length;

    for (var a = 0; a < childNodesLen; a++) {
      let childNode = childNodes[a];
      html += htmlOf(childNode);
    }

    return html;
  },

  // Webkit doesn't return anything when Object.getOwnPropertyDescriptor() is
  // called to get built-in accessors so we've got to fully re-implement
  // innerHTML if we can't get an accessor for it.
  set: function (html) {
    if (elProtoInnerHTML) {
      elProtoInnerHTML.set.call(this, html);
      return;
    }

    var frag = fragment.fromString(html);
    this.appendChild(frag);
  }
};
