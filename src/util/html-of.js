'use strict';

var voidElements = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

export default function htmlOf (node) {
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

  if (voidElements.indexOf(tagName) === -1) {
    for (let a = 0; a < childNodesLen; a++) {
      let childNode = childNodes[a];
      html += htmlOf(childNode);
    }

    html += `</${tagName}>`;
  }

  return html;
}
