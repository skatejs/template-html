(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './api/unwrap', './api/wrap', './api/wrapped', './util/content', './util/fragment', './util/mixin', './wrap/append-child', './wrap/child-element-count', './wrap/child-nodes', './wrap/children', './wrap/closest', './wrap/compare-document-position', './wrap/contains', './wrap/first-child', './wrap/first-element-child', './wrap/get-elements-by-class-name', './wrap/get-elements-by-tag-name', './wrap/has-child-nodes', './wrap/inner-html', './wrap/insert-adjacent-html', './wrap/insert-before', './wrap/last-child', './wrap/last-element-child', './wrap/matches', './wrap/next-element-sibling', './wrap/next-sibling', './wrap/outer-html', './wrap/parent-element', './wrap/parent-node', './wrap/previous-element-sibling', './wrap/previous-sibling', './wrap/query-selector', './wrap/query-selector-all', './wrap/remove-child', './wrap/remove', './wrap/replace-child', './wrap/text-content'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./api/unwrap'), require('./api/wrap'), require('./api/wrapped'), require('./util/content'), require('./util/fragment'), require('./util/mixin'), require('./wrap/append-child'), require('./wrap/child-element-count'), require('./wrap/child-nodes'), require('./wrap/children'), require('./wrap/closest'), require('./wrap/compare-document-position'), require('./wrap/contains'), require('./wrap/first-child'), require('./wrap/first-element-child'), require('./wrap/get-elements-by-class-name'), require('./wrap/get-elements-by-tag-name'), require('./wrap/has-child-nodes'), require('./wrap/inner-html'), require('./wrap/insert-adjacent-html'), require('./wrap/insert-before'), require('./wrap/last-child'), require('./wrap/last-element-child'), require('./wrap/matches'), require('./wrap/next-element-sibling'), require('./wrap/next-sibling'), require('./wrap/outer-html'), require('./wrap/parent-element'), require('./wrap/parent-node'), require('./wrap/previous-element-sibling'), require('./wrap/previous-sibling'), require('./wrap/query-selector'), require('./wrap/query-selector-all'), require('./wrap/remove-child'), require('./wrap/remove'), require('./wrap/replace-child'), require('./wrap/text-content'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiUnwrap, global.apiWrap, global.apiWrapped, global.content, global.fragment, global.mixin, global.wrapAppendChild, global.wrapChildElementCount, global.wrapChildNodes, global.wrapChildren, global.wrapClosest, global.wrapCompareDocumentPosition, global.wrapContains, global.wrapFirstChild, global.wrapFirstElementChild, global.wrapGetElementsByClassName, global.wrapGetElementsByTagName, global.wrapHasChildNodes, global.wrapInnerHTML, global.wrapInsertAdjacentHTML, global.wrapInsertBefore, global.wrapLastChild, global.wrapLastElementChild, global.wrapMatches, global.wrapNextElementSibling, global.wrapNextSibling, global.wrapOuterHTML, global.wrapParentElement, global.wrapParentNode, global.wrapPreviousElementSibling, global.wrapPreviousSibling, global.wrapQuerySelector, global.wrapQuerySelectorAll, global.wrapRemoveChild, global.wrapRemove, global.wrapReplaceChild, global.wrapTextContent);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiUnwrap, _apiWrap, _apiWrapped, _utilContent, _utilFragment, _utilMixin, _wrapAppendChild, _wrapChildElementCount, _wrapChildNodes, _wrapChildren, _wrapClosest, _wrapCompareDocumentPosition, _wrapContains, _wrapFirstChild, _wrapFirstElementChild, _wrapGetElementsByClassName, _wrapGetElementsByTagName, _wrapHasChildNodes, _wrapInnerHtml, _wrapInsertAdjacentHtml, _wrapInsertBefore, _wrapLastChild, _wrapLastElementChild, _wrapMatches, _wrapNextElementSibling, _wrapNextSibling, _wrapOuterHtml, _wrapParentElement, _wrapParentNode, _wrapPreviousElementSibling, _wrapPreviousSibling, _wrapQuerySelector, _wrapQuerySelectorAll, _wrapRemoveChild, _wrapRemove, _wrapReplaceChild, _wrapTextContent) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _apiUnwrap2 = _interopRequire(_apiUnwrap);

  var _apiWrap2 = _interopRequire(_apiWrap);

  var _apiWrapped2 = _interopRequire(_apiWrapped);

  var _content = _interopRequire(_utilContent);

  var _fragment = _interopRequire(_utilFragment);

  var _mixin = _interopRequire(_utilMixin);

  var _wrapAppendChild2 = _interopRequire(_wrapAppendChild);

  var _wrapChildElementCount2 = _interopRequire(_wrapChildElementCount);

  var _wrapChildNodes2 = _interopRequire(_wrapChildNodes);

  var _wrapChildren2 = _interopRequire(_wrapChildren);

  var _wrapClosest2 = _interopRequire(_wrapClosest);

  var _wrapCompareDocumentPosition2 = _interopRequire(_wrapCompareDocumentPosition);

  var _wrapContains2 = _interopRequire(_wrapContains);

  var _wrapFirstChild2 = _interopRequire(_wrapFirstChild);

  var _wrapFirstElementChild2 = _interopRequire(_wrapFirstElementChild);

  var _wrapGetElementsByClassName2 = _interopRequire(_wrapGetElementsByClassName);

  var _wrapGetElementsByTagName2 = _interopRequire(_wrapGetElementsByTagName);

  var _wrapHasChildNodes2 = _interopRequire(_wrapHasChildNodes);

  var _wrapInnerHTML = _interopRequire(_wrapInnerHtml);

  var _wrapInsertAdjacentHTML = _interopRequire(_wrapInsertAdjacentHtml);

  var _wrapInsertBefore2 = _interopRequire(_wrapInsertBefore);

  var _wrapLastChild2 = _interopRequire(_wrapLastChild);

  var _wrapLastElementChild2 = _interopRequire(_wrapLastElementChild);

  var _wrapMatches2 = _interopRequire(_wrapMatches);

  var _wrapNextElementSibling2 = _interopRequire(_wrapNextElementSibling);

  var _wrapNextSibling2 = _interopRequire(_wrapNextSibling);

  var _wrapOuterHTML = _interopRequire(_wrapOuterHtml);

  var _wrapParentElement2 = _interopRequire(_wrapParentElement);

  var _wrapParentNode2 = _interopRequire(_wrapParentNode);

  var _wrapPreviousElementSibling2 = _interopRequire(_wrapPreviousElementSibling);

  var _wrapPreviousSibling2 = _interopRequire(_wrapPreviousSibling);

  var _wrapQuerySelector2 = _interopRequire(_wrapQuerySelector);

  var _wrapQuerySelectorAll2 = _interopRequire(_wrapQuerySelectorAll);

  var _wrapRemoveChild2 = _interopRequire(_wrapRemoveChild);

  var _wrapRemove2 = _interopRequire(_wrapRemove);

  var _wrapReplaceChild2 = _interopRequire(_wrapReplaceChild);

  var _wrapTextContent2 = _interopRequire(_wrapTextContent);

  var Node = window.Node;
  var NodeProto = Node.prototype;
  var Element = window.Element;
  var HTMLElement = window.HTMLElement;

  // Our custom wrapper elements.
  var wrappers = {
    appendChild: _wrapAppendChild2,
    childElementCount: _wrapChildElementCount2,
    childNodes: _wrapChildNodes2,
    children: _wrapChildren2,
    closest: _wrapClosest2,
    compareDocumentPosition: _wrapCompareDocumentPosition2,
    contains: _wrapContains2,
    firstChild: _wrapFirstChild2,
    firstElementChild: _wrapFirstElementChild2,
    lastElementChild: _wrapLastElementChild2,
    lastChild: _wrapLastChild2,
    getElementsByClassName: _wrapGetElementsByClassName2,
    getElementsByTagName: _wrapGetElementsByTagName2,
    hasChildNodes: _wrapHasChildNodes2,
    innerHTML: _wrapInnerHTML,
    insertAdjacentHTML: _wrapInsertAdjacentHTML,
    insertBefore: _wrapInsertBefore2,
    matches: _wrapMatches2,
    nextElementSibling: _wrapNextElementSibling2,
    nextSibling: _wrapNextSibling2,
    outerHTML: _wrapOuterHTML,
    parentElement: _wrapParentElement2,
    parentNode: _wrapParentNode2,
    previousElementSibling: _wrapPreviousElementSibling2,
    previousSibling: _wrapPreviousSibling2,
    querySelector: _wrapQuerySelector2,
    querySelectorAll: _wrapQuerySelectorAll2,
    removeChild: _wrapRemoveChild2,
    replaceChild: _wrapReplaceChild2,
    remove: _wrapRemove2,
    textContent: _wrapTextContent2,

    // Wrappers for prefixed members.
    mozMatchesSelector: _wrapMatches2,
    msMatchesSelector: _wrapMatches2,
    webkitMatchesSelector: _wrapMatches2
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
            value: function value() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              var node = this.__node;
              return proto[currKey].apply(node, args);
            }
          };
        }

        // Proxy properties.
        return {
          get: function get() {
            return this.__node[currKey];
          },

          set: function set(value) {
            this.__node[currKey] = value;
          }
        };
      })();

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
      get: function get() {
        return this;
      }
    },

    // Returns whether or not the element is wrapped. Also returns true for the
    // wrapper.
    __wrapped: {
      get: function get() {
        return this.___wrapped;
      }
    },

    // Always returns the wrapped version of the element and ensures that even
    // if it is accessed on the wrapper that it still returns itself.
    __wrapper: {
      get: function get() {
        var _this = this;

        if (!this.___wrapper) {
          (function () {
            var node = _this;
            var wrapper = _this.___wrapper = Object.defineProperties({}, {
              __node: {
                get: function () {
                  return node;
                },
                configurable: true,
                enumerable: true
              },
              __wrapped: {
                get: function () {
                  return node.__wrapped;
                },
                configurable: true,
                enumerable: true
              },
              __wrapper: {
                get: function () {
                  return this;
                },
                configurable: true,
                enumerable: true
              }
            });

            if (_this instanceof Node) {
              _mixin(wrapper, members.Node);
            }

            if (_this instanceof Element) {
              _mixin(wrapper, members.Element);
            }

            if (_this instanceof HTMLElement) {
              _mixin(wrapper, members.HTMLElement);
            }
          })();
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
  function skateTemplateHtml() {
    var templateStr = [].slice.call(arguments).join('');
    var template = _fragment.fromString(templateStr);

    return function (target) {
      target = typeof target === 'string' ? _fragment.fromString(target).childNodes[0] : target;

      // There's an issue with passing in nodes that are already wrapped where we
      // must use their `innerHTML` rather than their `childNodes` as the light
      // DOM of the new shadow DOM being applied to the element.
      var frag = _fragment.fromNodeList(target.childNodes);

      skateTemplateHtml.unwrap(target);
      target.appendChild(template);
      _content.set(target, _content.data(target));
      skateTemplateHtml.wrap(target);
      _content.init(target);

      if (frag.childNodes.length) {
        target.appendChild(frag);
      }

      return target;
    };
  }

  skateTemplateHtml.unwrap = _apiUnwrap2;
  skateTemplateHtml.wrap = _apiWrap2;
  skateTemplateHtml.wrapped = _apiWrapped2;

  module.exports = window.skateTemplateHtml = skateTemplateHtml;
});