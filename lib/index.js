(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './api/unwrap', './api/wrap', './api/wrapped', './util/content', './util/fragment', './util/mixin', './wrap/append-child', './wrap/child-nodes', './wrap/children', './wrap/get-elements-by-tag-name', './wrap/inner-html', './wrap/insert-adjacent-html', './wrap/insert-before', './wrap/first-child', './wrap/last-child', './wrap/matches', './wrap/next-sibling', './wrap/outer-html', './wrap/parent-node', './wrap/previous-sibling', './wrap/remove-child', './wrap/remove', './wrap/replace-child', './wrap/text-content'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./api/unwrap'), require('./api/wrap'), require('./api/wrapped'), require('./util/content'), require('./util/fragment'), require('./util/mixin'), require('./wrap/append-child'), require('./wrap/child-nodes'), require('./wrap/children'), require('./wrap/get-elements-by-tag-name'), require('./wrap/inner-html'), require('./wrap/insert-adjacent-html'), require('./wrap/insert-before'), require('./wrap/first-child'), require('./wrap/last-child'), require('./wrap/matches'), require('./wrap/next-sibling'), require('./wrap/outer-html'), require('./wrap/parent-node'), require('./wrap/previous-sibling'), require('./wrap/remove-child'), require('./wrap/remove'), require('./wrap/replace-child'), require('./wrap/text-content'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiUnwrap, global.apiWrap, global.apiWrapped, global.content, global.fragment, global.mixin, global.wrapAppendChild, global.wrapChildNodes, global.wrapChildren, global.wrapGetElementsByTagName, global.wrapInnerHTML, global.wrapInsertAdjacentHTML, global.wrapInsertBefore, global.wrapFirstChild, global.wrapLastChild, global.wrapMatches, global.wrapNextSibling, global.wrapOuterHTML, global.wrapParentNode, global.wrapPreviousSibling, global.wrapRemoveChild, global.wrapRemove, global.wrapReplaceChild, global.wrapTextContent);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiUnwrap, _apiWrap, _apiWrapped, _utilContent, _utilFragment, _utilMixin, _wrapAppendChild, _wrapChildNodes, _wrapChildren, _wrapGetElementsByTagName, _wrapInnerHtml, _wrapInsertAdjacentHtml, _wrapInsertBefore, _wrapFirstChild, _wrapLastChild, _wrapMatches, _wrapNextSibling, _wrapOuterHtml, _wrapParentNode, _wrapPreviousSibling, _wrapRemoveChild, _wrapRemove, _wrapReplaceChild, _wrapTextContent) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _apiUnwrap2 = _interopRequire(_apiUnwrap);

  var _apiWrap2 = _interopRequire(_apiWrap);

  var _apiWrapped2 = _interopRequire(_apiWrapped);

  var _content = _interopRequire(_utilContent);

  var _fragment = _interopRequire(_utilFragment);

  var _mixin = _interopRequire(_utilMixin);

  var _wrapAppendChild2 = _interopRequire(_wrapAppendChild);

  var _wrapChildNodes2 = _interopRequire(_wrapChildNodes);

  var _wrapChildren2 = _interopRequire(_wrapChildren);

  var _wrapGetElementsByTagName2 = _interopRequire(_wrapGetElementsByTagName);

  var _wrapInnerHTML = _interopRequire(_wrapInnerHtml);

  var _wrapInsertAdjacentHTML = _interopRequire(_wrapInsertAdjacentHtml);

  var _wrapInsertBefore2 = _interopRequire(_wrapInsertBefore);

  var _wrapFirstChild2 = _interopRequire(_wrapFirstChild);

  var _wrapLastChild2 = _interopRequire(_wrapLastChild);

  var _wrapMatches2 = _interopRequire(_wrapMatches);

  var _wrapNextSibling2 = _interopRequire(_wrapNextSibling);

  var _wrapOuterHTML = _interopRequire(_wrapOuterHtml);

  var _wrapParentNode2 = _interopRequire(_wrapParentNode);

  var _wrapPreviousSibling2 = _interopRequire(_wrapPreviousSibling);

  var _wrapRemoveChild2 = _interopRequire(_wrapRemoveChild);

  var _wrapRemove2 = _interopRequire(_wrapRemove);

  var _wrapReplaceChild2 = _interopRequire(_wrapReplaceChild);

  var _wrapTextContent2 = _interopRequire(_wrapTextContent);

  var nodeProto = window.Node.prototype;
  var nodeMembers = {
    appendChild: _wrapAppendChild2,
    childNodes: _wrapChildNodes2,
    children: _wrapChildren2,
    firstChild: _wrapFirstChild2,
    lastChild: _wrapLastChild2,
    getElementsByTagName: _wrapGetElementsByTagName2,
    innerHTML: _wrapInnerHTML,
    insertAdjacentHTML: _wrapInsertAdjacentHTML,
    insertBefore: _wrapInsertBefore2,
    matches: _wrapMatches2,
    nextSibling: _wrapNextSibling2,
    outerHTML: _wrapOuterHTML,
    parentNode: _wrapParentNode2,
    previousSibling: _wrapPreviousSibling2,
    removeChild: _wrapRemoveChild2,
    replaceChild: _wrapReplaceChild2,
    remove: _wrapRemove2,
    textContent: _wrapTextContent2
  };

  // Define members that will proxy the real element's properties.
  ['attributes', 'nodeName', 'nodeType', 'nodeValue', 'tagName'].forEach(function (property) {
    nodeMembers[property] = {
      get: function get() {
        return this.__node[property];
      }
    };
  });

  ['getAttribute', 'setAttribute'].forEach(function (method) {
    nodeMembers[method] = {
      value: function value() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var el = this.__node;
        return el[method].apply(el, args);
      }
    };
  });

  // Property that ensures the element is always returned. Allows `.__node` to
  // be called on a real node, or a wrapper without having to check.
  Object.defineProperty(nodeProto, '__node', {
    get: function get() {
      return this;
    }
  });

  // Define an accessor to get a wrapped version of an element.
  Object.defineProperty(nodeProto, '__wrapper', {
    get: function get() {
      if (!this.___wrapper) {
        this.___wrapper = _mixin({}, nodeMembers);
        this.___wrapper.__node = this;
        this.___wrapper.__wrapper = this.___wrapper;
      }

      return this.___wrapper;
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