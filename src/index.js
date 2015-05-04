import apiUnwrap from './api/unwrap';
import apiWrap from './api/wrap';
import apiWrapped from './api/wrapped';
import content from './util/content';
import fragment from './util/fragment';
import mixin from './util/mixin';
import wrapAppendChild from './wrap/append-child';
import wrapChildNodes from './wrap/child-nodes';
import wrapChildren from './wrap/children';
import wrapGetElementsByTagName from './wrap/get-elements-by-tag-name';
import wrapInnerHTML from './wrap/inner-html';
import wrapInsertAdjacentHTML from './wrap/insert-adjacent-html';
import wrapInsertBefore from './wrap/insert-before';
import wrapFirstChild from './wrap/first-child';
import wrapLastChild from './wrap/last-child';
import wrapMatches from './wrap/matches';
import wrapNextSibling from './wrap/next-sibling';
import wrapOuterHTML from './wrap/outer-html';
import wrapParentNode from './wrap/parent-node';
import wrapPreviousSibling from './wrap/previous-sibling';
import wrapRemoveChild from './wrap/remove-child';
import wrapRemove from './wrap/remove';
import wrapReplaceChild from './wrap/replace-child';
import wrapTextContent from './wrap/text-content';

var nodeProto = window.Node.prototype;
var nodeMembers = {
  appendChild: wrapAppendChild,
  childNodes: wrapChildNodes,
  children: wrapChildren,
  firstChild: wrapFirstChild,
  lastChild: wrapLastChild,
  getElementsByTagName: wrapGetElementsByTagName,
  innerHTML: wrapInnerHTML,
  insertAdjacentHTML: wrapInsertAdjacentHTML,
  insertBefore: wrapInsertBefore,
  matches: wrapMatches,
  nextSibling: wrapNextSibling,
  outerHTML: wrapOuterHTML,
  parentNode: wrapParentNode,
  previousSibling: wrapPreviousSibling,
  removeChild: wrapRemoveChild,
  replaceChild: wrapReplaceChild,
  remove: wrapRemove,
  textContent: wrapTextContent
};

// Define members that will proxy the real element's properties.
[
  'attributes',
  'nodeName',
  'nodeType',
  'nodeValue',
  'tagName'
].forEach(function (property) {
  nodeMembers[property] = {
    get: function () {
      return this.__node[property];
    }
  };
});

[
  'getAttribute',
  'setAttribute'
].forEach(function (method) {
  nodeMembers[method] = {
    value: function (...args) {
      var node = this.__node;
      return node[method].apply(node, args);
    }
  };
});

Object.defineProperties(nodeProto, {
  // Property that ensures the element is always returned. Allows `.__node` to
  // be called on a real node, or a wrapper without having to check.
  __node: {
    get: function () {
      return this;
    }
  },

  // Returns whether or not the element is wrapped. Also returns true for the
  // wrapper.
  __wrapped: {
    get: function () {
      return this.___wrapped;
    }
  },

  // Always returns the wrapped version of the element and ensures that even
  // if it is accessed on the wrapper that it still returns itself.
  __wrapper: {
    get: function () {
      if (!this.___wrapper) {
        let node = this;
        this.___wrapper = mixin({
          get __node () {
            return node;
          },

          get __wrapped () {
            return node.__wrapped;
          },

          get __wrapper () {
            return this;
          }
        }, nodeMembers);
      }

      return this.___wrapper;
    }
  }
});

// Override DOM manipulators to ensure a real DOM element is passed in instead
// of a wrapper.
var oldAppendChild = nodeProto.appendChild;
nodeProto.appendChild = function (node) {
  return oldAppendChild.call(this.__node, node.__node);
};
var oldInsertBefore = nodeProto.insertBefore;
nodeProto.insertBefore = function (node, reference) {
  return oldInsertBefore.call(this.__node, node.__node, reference && reference.__node);
};
var oldRemoveChild = nodeProto.removeChild;
nodeProto.removeChild = function (node) {
  return oldRemoveChild.call(this.__node, node.__node);
};
var oldReplaceChild = nodeProto.replaceChild;
nodeProto.replaceChild = function (node, reference) {
  return oldReplaceChild.call(this.__node, node.__node, reference.__node);
};

// Override `document.createElement()` to provide a wrapped node.
var oldCreateElement = document.createElement.bind(document);
document.createElement = function (name, parent) {
  return (parent ? oldCreateElement(name, parent) : oldCreateElement(name)).__wrapper;
};

// Public API
function skateTemplateHtml () {
  var templateStr = [].slice.call(arguments).join('');
  var template = fragment.fromString(templateStr);

  return function (target) {
    target = typeof target === 'string' ?
      fragment.fromString(target).childNodes[0] :
      target;

    // There's an issue with passing in nodes that are already wrapped where we
    // must use their `innerHTML` rather than their `childNodes` as the light
    // DOM of the new shadow DOM being applied to the element.
    var frag = fragment.fromNodeList(target.childNodes);

    skateTemplateHtml.unwrap(target);
    target.appendChild(template);
    content.set(target, content.data(target));
    skateTemplateHtml.wrap(target);
    content.init(target);

    if (frag.childNodes.length) {
      target.appendChild(frag);
    }

    return target;
  };
}

skateTemplateHtml.unwrap = apiUnwrap;
skateTemplateHtml.wrap = apiWrap;
skateTemplateHtml.wrapped = apiWrapped;

export default window.skateTemplateHtml = skateTemplateHtml;
