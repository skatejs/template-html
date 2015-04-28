'use strict';

import content from './util/content';
import fixInnerHTML from './fix/inner-html';
import fragment from './util/fragment';
import wrapAppendChild from './wrap/append-child';
import wrapChildNodes from './wrap/child-nodes';
import wrapChildren from './wrap/children';
import wrapFirstChild from './wrap/first-child';
import wrapInnerHTML from './wrap/inner-html';
import wrapInsertAdjacentHTML from './wrap/insert-adjacent-html';
import wrapInsertBefore from './wrap/insert-before';
import wrapLastChild from './wrap/last-child';
import wrapOuterHTML from './wrap/outer-html';
import wrapRemoveChild from './wrap/remove-child';
import wrapReplaceChild from './wrap/replace-child';
import wrapTextContent from './wrap/text-content';

var elProto = window.Element.prototype;
var fixes = {
  innerHTML: fixInnerHTML
};
var wrapper = {
  appendChild: wrapAppendChild,
  childNodes: wrapChildNodes,
  children: wrapChildren,
  firstChild: wrapFirstChild,
  innerHTML: wrapInnerHTML,
  insertAdjacentHTML: wrapInsertAdjacentHTML,
  insertBefore: wrapInsertBefore,
  lastChild: wrapLastChild,
  outerHTML: wrapOuterHTML,
  removeChild: wrapRemoveChild,
  replaceChild: wrapReplaceChild,
  textContent: wrapTextContent
};

function cacheContentData (node) {
  var contentNodes = node.getElementsByTagName('content');
  var contentNodesLen = contentNodes && contentNodes.length;
  var contentData = [];

  if (contentNodesLen) {
    while (contentNodes.length) {
      var contentNode = contentNodes[0];
      var parentNode = contentNode.parentNode;
      var selector = contentNode.getAttribute('select');
      var startNode = document.createComment(' content ');
      var endNode = document.createComment(' /content ');

      contentData.push({
        container: parentNode,
        contentNode: contentNode,
        defaultNodes: [].slice.call(contentNode.childNodes),
        endNode: endNode,
        isDefault: true,
        selector: selector,
        startNode: startNode
      });

      parentNode.replaceChild(endNode, contentNode);
      parentNode.insertBefore(startNode, endNode);

      // Cache data in the comment that can be read if no content information
      // is cached. This allows seamless server-side rendering.
      startNode.textContent += JSON.stringify({
        defaultContent: contentNode.innerHTML,
        selector: selector
      }) + ' ';
    }
  }

  content.set(node, contentData);
}



// Content Parser
// --------------

function parseCommentNode (node) {
  var data;
  var matches = node.textContent.match(/^ (\/?)content (.*)/i);

  if (matches) {
    if (matches[2]) {
      try {
        data = JSON.parse(matches[2]);
      } catch (e) {
        throw new Error('Unable to parse content comment data: "' + e + '" in "<!--' + node.textContent + '-->".');
      }
    }

    return {
      data: data || {
        defaultContent: undefined,
        isDefault: undefined,
        selector: undefined
      },
      type: matches[1] ? 'close' : 'open'
    };
  }
}

function parseNodeForContent (node) {
  var a;
  var childNodes = node.childNodes;
  var childNodesLen = childNodes.length;
  var contentDatas = [];
  var lastContentNode;

  for (a = 0; a < childNodesLen; a++) {
    var childNode = childNodes[a];

    if (childNode.nodeType === 8) {
      var contentInfo = parseCommentNode(childNode);

      if (contentInfo) {
        if (contentInfo.type === 'open') {
          if (lastContentNode) {
            throw new Error('Cannot have an opening content placeholder after another content placeholder at the same level in the DOM tree: "' + childNode.textContent + '" in "' + childNode.parentNode.innerHTML + '".');
          }

          lastContentNode = {
            container: childNode.parentNode,
            contentNode: childNode,
            defaultNodes: contentInfo.data.defaultContent && fragment.fromString(contentInfo.data.defaultContent).childNodes || [],
            isDefault: contentInfo.data.isDefault,
            selector: contentInfo.data.selector,
            startNode: childNode
          };
        } else if (contentInfo.type === 'close') {
          if (!lastContentNode) {
            throw new Error('Unmatched closing content placeholder: "' + childNode.textContent + '" in "' + childNode.parentNode.innerHTML + '".');
          }

          lastContentNode.endNode = childNode;
          contentDatas.push(lastContentNode);
          lastContentNode = undefined;
        }
      }
    } else {
      contentDatas = contentDatas.concat(parseNodeForContent(childNode));
    }
  }

  return contentDatas;
}


// Public API
// ----------

function skateTemplateHtml () {
  var template = [].slice.call(arguments).join('');

  return function (target) {
    // There's an issue with passing in nodes that are already wrapped where we
    // must use their `innerHTML` rather than their `childNodes` as the light
    // DOM of the new shadow DOM being applied to the element.
    var frag = target.__wrapped ?
      fragment.fromString(target.innerHTML) :
      fragment.fromNodeList(target.childNodes);

    skateTemplateHtml.unwrap(target);
    target.innerHTML = template;
    cacheContentData(target);
    skateTemplateHtml.wrap(target);

    if (frag.childNodes.length) {
      target.appendChild(frag);
    }

    return target;
  };
}

skateTemplateHtml.wrap = function (node) {
  if (node.__wrapped) {
    return node;
  }

  if (!content.get(node)) {
    content.set(node, parseNodeForContent(node));
  }

  for (let name in wrapper) {
    let elProtoDescriptor = Object.getOwnPropertyDescriptor(elProto, name) || { value: node[name] };
    let savedName = '__' + name;

    // Allows overridden properties to be overridden.
    elProtoDescriptor.configurable = wrapper[name].configurable = true;

    // Save the old property so that it can be used if need be.
    Object.defineProperty(node, savedName, elProtoDescriptor);

    // Define the overridden property.
    Object.defineProperty(node, name, wrapper[name]);
  }

  node.__wrapped = true;
  return node;
};

skateTemplateHtml.unwrap = function (node) {
  if (!node.__wrapped) {
    return node;
  }

  for (let name in wrapper) {
    let savedName = '__' + name;
    Object.defineProperty(node, name, Object.getOwnPropertyDescriptor(node, savedName) || {
      configurable: true,
      value: node[savedName]
    });
  }

  node.__wrapped = false;
  return node;
};


// Fixes to Native Implementations
// -------------------------------

for (let name in fixes) {
  Object.defineProperty(elProto, name, fixes[name]);
}


// Exporting
// ---------

// Global.
window.skateTemplateHtml = skateTemplateHtml;

// AMD.
if (typeof define === 'function') {
  define(function () {
    return skateTemplateHtml;
  });
}

// CommonJS.
if (typeof module === 'object') {
  module.exports = skateTemplateHtml;
}

export default skateTemplateHtml;
