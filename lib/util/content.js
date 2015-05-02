(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.fragment);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _fragment) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _fragment2 = _interopRequire(_fragment);

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

  var _default = (function () {
    var _class = function _default() {
      _classCallCheck(this, _class);
    };

    _createClass(_class, null, [{
      key: 'get',
      value: function get(element) {
        return element.__element.__skateTemplateHtmlContent;
      }
    }, {
      key: 'set',
      value: function set(element, content) {
        element.__element.__skateTemplateHtmlContent = content;
        return this;
      }
    }, {
      key: 'init',
      value: function init(element) {
        var that = this;
        this.get(element).forEach(function (content) {
          that.addDefault(content);
        });
        return this;
      }
    }, {
      key: 'data',
      value: function data(node) {
        node = node.__element;
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

        return contentData;
      }
    }, {
      key: 'parse',
      value: function parse(node) {
        node = node.__element;
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
                  defaultNodes: contentInfo.data.defaultContent && _fragment2.fromString(contentInfo.data.defaultContent).childNodes || [],
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
            contentDatas = contentDatas.concat(this.parse(childNode));
          }
        }

        return contentDatas;
      }
    }, {
      key: 'addDefault',
      value: function addDefault(content) {
        var nodes = content.defaultNodes;
        var nodesLen = nodes.length;

        for (var a = 0; a < nodesLen; a++) {
          content.container.__element.insertBefore(nodes[a], content.endNode);
        }

        content.isDefault = true;
        return this;
      }
    }, {
      key: 'removeDefault',
      value: function removeDefault(content) {
        var nodes = content.defaultNodes;
        var nodesLen = nodes.length;

        for (var a = 0; a < nodesLen; a++) {
          var node = nodes[a];
          node.parentNode.__element.removeChild(node);
        }

        content.isDefault = false;
        return this;
      }
    }]);

    return _class;
  })();

  module.exports = _default;
});