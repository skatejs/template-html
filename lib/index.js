(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './util/content', './fix/inner-html', './fix/text-content', './util/fragment', './wrap/append-child', './wrap/child-nodes', './wrap/children', './wrap/first-child', './wrap/inner-html', './wrap/insert-adjacent-html', './wrap/insert-before', './wrap/last-child', './wrap/outer-html', './wrap/remove-child', './wrap/replace-child', './wrap/text-content'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./util/content'), require('./fix/inner-html'), require('./fix/text-content'), require('./util/fragment'), require('./wrap/append-child'), require('./wrap/child-nodes'), require('./wrap/children'), require('./wrap/first-child'), require('./wrap/inner-html'), require('./wrap/insert-adjacent-html'), require('./wrap/insert-before'), require('./wrap/last-child'), require('./wrap/outer-html'), require('./wrap/remove-child'), require('./wrap/replace-child'), require('./wrap/text-content'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.content, global.fixInnerHTML, global.fixTextContent, global.fragment, global.wrapAppendChild, global.wrapChildNodes, global.wrapChildren, global.wrapFirstChild, global.wrapInnerHTML, global.wrapInsertAdjacentHTML, global.wrapInsertBefore, global.wrapLastChild, global.wrapOuterHTML, global.wrapRemoveChild, global.wrapReplaceChild, global.wrapTextContent);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilContent, _fixInnerHtml, _fixTextContent, _utilFragment, _wrapAppendChild, _wrapChildNodes, _wrapChildren, _wrapFirstChild, _wrapInnerHtml, _wrapInsertAdjacentHtml, _wrapInsertBefore, _wrapLastChild, _wrapOuterHtml, _wrapRemoveChild, _wrapReplaceChild, _wrapTextContent) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _content = _interopRequire(_utilContent);

  var _fixInnerHTML = _interopRequire(_fixInnerHtml);

  var _fixTextContent2 = _interopRequire(_fixTextContent);

  var _fragment = _interopRequire(_utilFragment);

  var _wrapAppendChild2 = _interopRequire(_wrapAppendChild);

  var _wrapChildNodes2 = _interopRequire(_wrapChildNodes);

  var _wrapChildren2 = _interopRequire(_wrapChildren);

  var _wrapFirstChild2 = _interopRequire(_wrapFirstChild);

  var _wrapInnerHTML = _interopRequire(_wrapInnerHtml);

  var _wrapInsertAdjacentHTML = _interopRequire(_wrapInsertAdjacentHtml);

  var _wrapInsertBefore2 = _interopRequire(_wrapInsertBefore);

  var _wrapLastChild2 = _interopRequire(_wrapLastChild);

  var _wrapOuterHTML = _interopRequire(_wrapOuterHtml);

  var _wrapRemoveChild2 = _interopRequire(_wrapRemoveChild);

  var _wrapReplaceChild2 = _interopRequire(_wrapReplaceChild);

  var _wrapTextContent2 = _interopRequire(_wrapTextContent);

  var elProto = window.Element.prototype;
  var fixes = {
    innerHTML: _fixInnerHTML,
    textContent: _fixTextContent2
  };
  var wrapper = {
    appendChild: _wrapAppendChild2,
    childNodes: _wrapChildNodes2,
    children: _wrapChildren2,
    firstChild: _wrapFirstChild2,
    innerHTML: _wrapInnerHTML,
    insertAdjacentHTML: _wrapInsertAdjacentHTML,
    insertBefore: _wrapInsertBefore2,
    lastChild: _wrapLastChild2,
    outerHTML: _wrapOuterHTML,
    removeChild: _wrapRemoveChild2,
    replaceChild: _wrapReplaceChild2,
    textContent: _wrapTextContent2
  };

  function cacheContentData(node) {
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

    _content.set(node, contentData);
  }

  // Content Parser
  // --------------

  function parseCommentNode(node) {
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

  function parseNodeForContent(node) {
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
              defaultNodes: contentInfo.data.defaultContent && _fragment.fromString(contentInfo.data.defaultContent).childNodes || [],
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

  function skateTemplateHtml() {
    var template = [].slice.call(arguments).join('');

    return function (target) {
      // There's an issue with passing in nodes that are already wrapped where we
      // must use their `innerHTML` rather than their `childNodes` as the light
      // DOM of the new shadow DOM being applied to the element.
      var frag = target.__wrapped ? _fragment.fromString(target.innerHTML) : _fragment.fromNodeList(target.childNodes);

      skateTemplateHtml.unwrap(target);
      target.innerHTML = template;
      cacheContentData(target);
      skateTemplateHtml.wrap(target);
      _content.init(target);

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

    if (!_content.get(node)) {
      _content.set(node, parseNodeForContent(node));
    }

    for (var _name in wrapper) {
      var elProtoDescriptor = Object.getOwnPropertyDescriptor(elProto, _name) || { value: node[_name] };
      var savedName = '__' + _name;

      // Allows overridden properties to be overridden.
      elProtoDescriptor.configurable = wrapper[_name].configurable = true;

      // Save the old property so that it can be used if need be.
      Object.defineProperty(node, savedName, elProtoDescriptor);

      // Define the overridden property.
      Object.defineProperty(node, _name, wrapper[_name]);
    }

    node.__wrapped = true;
    return node;
  };

  skateTemplateHtml.unwrap = function (node) {
    if (!node.__wrapped) {
      return node;
    }

    for (var _name2 in wrapper) {
      var savedName = '__' + _name2;
      Object.defineProperty(node, _name2, Object.getOwnPropertyDescriptor(node, savedName) || {
        configurable: true,
        value: node[savedName]
      });
    }

    node.__wrapped = false;
    return node;
  };

  // Fixes to Native Implementations
  // -------------------------------

  for (var _name3 in fixes) {
    Object.defineProperty(elProto, _name3, fixes[_name3]);
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

  module.exports = skateTemplateHtml;
});