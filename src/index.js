import apiUnwrap from './api/unwrap';
import apiWrap from './api/wrap';
import apiWrapped from './api/wrapped';
import content from './util/content';
import fragment from './util/fragment';
import mixin from './util/mixin';
import wrapAppendChild from './wrap/append-child';
import wrapChildElementCount from './wrap/child-element-count';
import wrapChildNodes from './wrap/child-nodes';
import wrapChildren from './wrap/children';
import wrapClosest from './wrap/closest';
import wrapCompareDocumentPosition from './wrap/compare-document-position';
import wrapContains from './wrap/contains';
import wrapFirstChild from './wrap/first-child';
import wrapFirstElementChild from './wrap/first-element-child';
import wrapGetElementsByClassName from './wrap/get-elements-by-class-name';
import wrapGetElementsByTagName from './wrap/get-elements-by-tag-name';
import wrapHasChildNodes from './wrap/has-child-nodes';
import wrapInnerHTML from './wrap/inner-html';
import wrapInsertAdjacentHTML from './wrap/insert-adjacent-html';
import wrapInsertBefore from './wrap/insert-before';
import wrapLastChild from './wrap/last-child';
import wrapLastElementChild from './wrap/last-element-child';
import wrapMatches from './wrap/matches';
import wrapNextElementSibling from './wrap/next-element-sibling';
import wrapNextSibling from './wrap/next-sibling';
import wrapOuterHTML from './wrap/outer-html';
import wrapParentElement from './wrap/parent-element';
import wrapParentNode from './wrap/parent-node';
import wrapPreviousElementSibling from './wrap/previous-element-sibling';
import wrapPreviousSibling from './wrap/previous-sibling';
import wrapQuerySelector from './wrap/query-selector';
import wrapQuerySelectorAll from './wrap/query-selector-all';
import wrapRemoveChild from './wrap/remove-child';
import wrapRemove from './wrap/remove';
import wrapReplaceChild from './wrap/replace-child';
import wrapTextContent from './wrap/text-content';

var Node = window.Node;
var NodeProto = Node.prototype;
var Element = window.Element;
var HTMLElement = window.HTMLElement;

// Our custom wrapper elements.
var wrappers = {
  appendChild: wrapAppendChild,
  childElementCount: wrapChildElementCount,
  childNodes: wrapChildNodes,
  children: wrapChildren,
  closest: wrapClosest,
  compareDocumentPosition: wrapCompareDocumentPosition,
  contains: wrapContains,
  firstChild: wrapFirstChild,
  firstElementChild: wrapFirstElementChild,
  lastElementChild: wrapLastElementChild,
  lastChild: wrapLastChild,
  getElementsByClassName: wrapGetElementsByClassName,
  getElementsByTagName: wrapGetElementsByTagName,
  hasChildNodes: wrapHasChildNodes,
  innerHTML: wrapInnerHTML,
  insertAdjacentHTML: wrapInsertAdjacentHTML,
  insertBefore: wrapInsertBefore,
  matches: wrapMatches,
  nextElementSibling: wrapNextElementSibling,
  nextSibling: wrapNextSibling,
  outerHTML: wrapOuterHTML,
  parentElement: wrapParentElement,
  parentNode: wrapParentNode,
  previousElementSibling: wrapPreviousElementSibling,
  previousSibling: wrapPreviousSibling,
  querySelector: wrapQuerySelector,
  querySelectorAll: wrapQuerySelectorAll,
  removeChild: wrapRemoveChild,
  replaceChild: wrapReplaceChild,
  remove: wrapRemove,
  textContent: wrapTextContent,

  // Wrappers for prefixed members.
  mozMatchesSelector: wrapMatches,
  msMatchesSelector: wrapMatches,
  webkitMatchesSelector: wrapMatches
};

// Builds a list of wrapper members for each type of node.
var members = ['Node', 'Element', 'HTMLElement'].reduce(function (prevProto, currProto) {
  var proto = window[currProto].prototype;
  prevProto[currProto] = Object.keys(proto).reduce(function (prevKey, currKey) {
    prevKey[currKey] = (function () {
      // Custom wrappers.
      if (wrappers[currKey]) {
        return wrappers[currKey];
      }

      // Proxy methods.
      if (typeof Object.getOwnPropertyDescriptor(proto, currKey).value === 'function') {
        return {
          value: function (...args) {
            var node = this.__node;
            return proto[currKey].apply(node, args);
          }
        };
      }

      // Proxy properties.
      return {
        get: function () {
          return this.__node[currKey];
        },

        set: function (value) {
          this.__node[currKey] = value;
        }
      };
    }());

    return prevKey;
  }, {});

  return prevProto;
}, {});

// Define properties on nodes that allow us to switch between the node and
// wrapper object. No matter if we have a reference to the node, or a wrapper,
// accessing either one is the same and prevents the need for checking.
Object.defineProperties(NodeProto, {
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
        let wrapper = this.___wrapper = {
          get __node () {
            return node;
          },

          get __wrapped () {
            return node.__wrapped;
          },

          get __wrapper () {
            return this;
          }
        };

        if (this instanceof Node) {
          mixin(wrapper, members.Node);
        }

        if (this instanceof Element) {
          mixin(wrapper, members.Element);
        }

        if (this instanceof HTMLElement) {
          mixin(wrapper, members.HTMLElement);
        }
      }

      return this.___wrapper;
    }
  }
});

// Override DOM manipulators to ensure a real DOM element is passed in instead
// of a wrapper. This covers elements not created through
// `document.createElement()` and elements not accessed / created through the
// wrapper.
var oldAppendChild = NodeProto.appendChild;
NodeProto.appendChild = function (node) {
  return oldAppendChild.call(this.__node, node.__node);
};
var oldInsertBefore = NodeProto.insertBefore;
NodeProto.insertBefore = function (node, reference) {
  return oldInsertBefore.call(this.__node, node.__node, reference && reference.__node);
};
var oldRemoveChild = NodeProto.removeChild;
NodeProto.removeChild = function (node) {
  return oldRemoveChild.call(this.__node, node.__node);
};
var oldReplaceChild = NodeProto.replaceChild;
NodeProto.replaceChild = function (node, reference) {
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
