// src/api/unwrap.js
__4bbc0370540a5383d67c35e46b29b926 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = function (node) {
    node.__skateTemplateHtmlWrapped = false;
    return node;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/fragment.js
__d63a0d8055a792e36bedf197bb39b3a9 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    fromNodeList: function fromNodeList(nodeList) {
      var frag = document.createDocumentFragment();
  
      if (Array.isArray(nodeList)) {
        var nodeListLength = nodeList.length;
        for (var a = 0; a < nodeListLength; a++) {
          frag.appendChild(nodeList[a]);
        }
      } else {
        while (nodeList && nodeList.length) {
          frag.appendChild(nodeList[0]);
        }
      }
  
      return frag;
    },
  
    fromString: function fromString(domString) {
      var specialMap = {
        caption: 'table',
        dd: 'dl',
        dt: 'dl',
        li: 'ul',
        tbody: 'table',
        td: 'tr',
        thead: 'table',
        tr: 'tbody'
      };
  
      var tag = domString.match(/\s*<([^\s>]+)/);
      var div = document.createElement(tag && specialMap[tag[1]] || 'div').__element;
  
      div.innerHTML = domString;
  
      return this.fromNodeList(div.childNodes);
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/content.js
__19ae81b353686d785b09cf84bda3c843 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);function parseCommentNode(node) {
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
                  defaultNodes: contentInfo.data.defaultContent && _fragment2['default'].fromString(contentInfo.data.defaultContent).childNodes || [],
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
  
  exports['default'] = _default;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/wrap.js
__2bf9938321c0852e2197e9ec5e7b5b21 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);exports['default'] = function (node) {
    node.__skateTemplateHtmlWrapped = true;
  
    if (!_content2['default'].get(node)) {
      _content2['default'].set(node, _content2['default'].parse(node));
    }
  
    return node;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/wrapped.js
__cefeb6c44c336fdd28876dc2cec99415 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = function (node) {
    return !!node.__skateTemplateHtmlWrapped;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/property.js
__25bbe2a4faa9a7b273ac588055e7157d = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = function (child, name, descriptor) {
    descriptor.configurable = true;
    Object.defineProperty(child, name, descriptor);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/mixin.js
__125890a9273e80bd87d26767cffe1164 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _property = __25bbe2a4faa9a7b273ac588055e7157d;
  
  var _property2 = _interopRequireDefault(_property);exports['default'] = function (proto, parent) {
    Object.keys(parent).forEach(function (key) {
      _property2['default'](proto, key, parent[key]);
    });
    return proto;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/decide.js
__82323c269111294e19265f0584377c01 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _wrapped = __cefeb6c44c336fdd28876dc2cec99415;
  
  var _wrapped2 = _interopRequireDefault(_wrapped);exports['default'] = function (fnWrapped, fnUnwrapped) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      var node = this.__element;
      var opts = {
        args: args,
        content: _content2['default'].get(node),
        node: node
      };
      return _wrapped2['default'](this) ? fnWrapped.call(this, opts) : fnUnwrapped.call(this, opts);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/append-child.js
__0e3ab07e564369cb50c217a40c5153b9 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);exports['default'] = {
    value: _decide2['default'](function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var node = data.args[0];
      var that = this;
  
      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;
  
        [].slice.call(fragChildNodes).forEach(function (node) {
          that.appendChild(node);
        });
  
        return this;
      }
  
      for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var selector = contentNode.selector;
  
        if (!selector || node.__wrapper.matches(selector)) {
          _content2['default'].removeDefault(contentNode);
          contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
          break;
        }
      }
  
      return this;
    }, function (data) {
      return data.node.appendChild(data.args[0]);
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/query.js
__da5044b769c20eb875606fc21a2002b2 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });var elementProto = window.HTMLElement.prototype;
  var matchesSelector = elementProto.matches || elementProto.msMatchesSelector || elementProto.webkitMatchesSelector || elementProto.mozMatchesSelector || elementProto.oMatchesSelector;
  
  exports['default'] = {
    between: function between(startNode, endNode) {
      var nodes = [];
      var nextNode = startNode.nextSibling;
  
      while (nextNode !== endNode) {
        nodes.push(nextNode);
        nextNode = nextNode.nextSibling;
      }
  
      return nodes;
    },
  
    matches: function matches(node, selector) {
      return node.nodeType === 1 && matchesSelector.call(node, selector);
    },
  
    selector: (function (_selector) {
      function selector(_x, _x2) {
        return _selector.apply(this, arguments);
      }
  
      selector.toString = function () {
        return _selector.toString();
      };
  
      return selector;
    })(function (sourceNode, selector) {
      if (selector) {
        var found = sourceNode.querySelectorAll(selector);
        var foundLength = found.length;
        var filtered = [];
  
        for (var a = 0; a < foundLength; a++) {
          var node = found[a];
  
          if (node.parentNode === sourceNode) {
            filtered.push(node);
          }
        }
  
        return filtered;
      }
  
      return [].slice.call(sourceNode.childNodes) || [];
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/child-nodes.js
__a47b51ebb809469e3e4f3e37b30c8679 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);
  
  var _query = __da5044b769c20eb875606fc21a2002b2;
  
  var _query2 = _interopRequireDefault(_query);exports['default'] = {
    get: _decide2['default'](function (data) {
      return data.content.reduce(function (prev, curr) {
        return prev.concat(curr.isDefault ? [] : _query2['default'].between(curr.startNode, curr.endNode).map(function (node) {
          return node.__wrapper;
        }));
      }, []);
    }, function (opts) {
      var nodes = [];
      var chNodes = opts.node.childNodes;
      var chNodesLen = chNodes.length;
  
      for (var a = 0; a < chNodesLen; a++) {
        nodes.push(chNodes[a].__wrapper);
      }
  
      return nodes;
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/children.js
__ded42f60d281914c4dbaf7d9b268e729 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    get: function get() {
      return this.childNodes.filter(function (node) {
        return node.nodeType === 1;
      });
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/get-elements-by-tag-name.js
__0aba65d9734ef3ff590bbd491fea85f8 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    value: function value(tagName) {
      return this.__element.getElementsByTagName(tagName);
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/inner-html.js
__221f2303ac1c3e63084bc2f7a59450f3 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);
  
  var _query = __da5044b769c20eb875606fc21a2002b2;
  
  var _query2 = _interopRequireDefault(_query);
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);exports['default'] = {
    get: _decide2['default'](function () {
      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;
  
      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += childNode.outerHTML || childNode.textContent;
      }
  
      return html;
    }, function (data) {
      return data.node.innerHTML;
    }),
  
    set: _decide2['default'](function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var html = data.args[0];
      var targetFragment = _fragment2['default'].fromString(html);
  
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
        var childNodes = _query2['default'].between(contentNode.startNode, contentNode.endNode);
  
        // Remove all nodes (including default content).
        for (var b = 0; b < childNodes.length; b++) {
          var childNode = childNodes[b];
          childNode.parentNode.removeChild(childNode);
        }
  
        var foundNodes = _query2['default'].selector(targetFragment, contentNode.selector);
  
        // Add any matched nodes from the given HTML.
        for (var c = 0; c < foundNodes.length; c++) {
          var node = foundNodes[c];
          contentNode.container.insertBefore(node, contentNode.endNode);
          this.childNodes.push(node);
        }
  
        // If no nodes were found, set the default content.
        if (foundNodes.length) {
          _content2['default'].removeDefault(contentNode);
        } else {
          _content2['default'].addDefault(contentNode);
        }
      }
    }, function (data) {
      data.node.innerHTML = data.args[0];
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/insert-adjacent-html.js
__aa76ad923873788370a073d5b4f922ee = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);exports['default'] = {
    value: function value(where, html) {
      var frag = _fragment2['default'].fromString(html);
  
      if (where === 'beforebegin') {
        this.parentNode.insertBefore(frag, this);
      } else if (where === 'afterbegin') {
        this.insertBefore(frag, this.childNodes[0]);
      } else if (where === 'beforeend') {
        this.appendChild(frag);
      } else if (where === 'afterend') {
        this.parentNode.insertBefore(frag, this.nextSibling);
      }
  
      return this;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/insert-before.js
__d25c541b4b60e1c1fac0d397e97f283a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);
  
  var _query = __da5044b769c20eb875606fc21a2002b2;
  
  var _query2 = _interopRequireDefault(_query);exports['default'] = {
    value: _decide2['default'](function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var node = data.args[0].__element;
      var referenceNode = data.args[1].__element;
  
      // If no reference node is supplied, we append. This also means that we
      // don't need to add / remove any default content because either there
      // aren't any nodes or appendChild will handle it.
      if (!referenceNode) {
        return this.appendChild(node);
      }
  
      // Handle document fragments.
      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;
  
        if (fragChildNodes) {
          var fragChildNodesLength = fragChildNodes.length;
  
          for (var a = 0; a < fragChildNodesLength; a++) {
            this.insertBefore(fragChildNodes[a], referenceNode);
          }
        }
  
        return this;
      }
  
      var hasFoundReferenceNode = false;
  
      // There's no reason to handle default content add / remove because:
      // 1. If no reference node is supplied, appendChild handles it.
      // 2. If a reference node is supplied, there already is content.
      // 3. If a reference node is invalid, an exception is thrown, but also
      //    it's state would not change even if it wasn't.
      mainLoop: for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var betweenNodes = _query2['default'].between(contentNode.startNode, contentNode.endNode);
        var betweenNodesLen = betweenNodes.length;
  
        for (var c = 0; c < betweenNodesLen; c++) {
          var betweenNode = betweenNodes[c];
  
          if (betweenNode === referenceNode) {
            hasFoundReferenceNode = true;
          }
  
          if (hasFoundReferenceNode) {
            var selector = contentNode.selector;
            if (!selector || node.__wrapper.matches(selector)) {
              betweenNode.parentNode.insertBefore(node, betweenNode);
              break mainLoop;
            }
          }
        }
      }
  
      // If no reference node was found as a child node of the element we must
      // throw an error. This works for both no child nodes, or if the
      // reference wasn't found to be a child node.
      if (!hasFoundReferenceNode) {
        throw new Error('DOMException 8: The node before which the new node is to be inserted is not a child of this node.');
      }
  
      return node;
    }, function (data) {
      return data.node.insertBefore(data.args[0], data.args[1]);
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/first-child.js
__53deeeb529258e755449195071912bf8 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    get: function get() {
      return this.childNodes[0];
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/last-child.js
__a49769da5b63824d5560db509487733c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    get: function get() {
      var childNodes = this.childNodes;
      return childNodes[childNodes.length - 1];
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/matches.js
__a44fc57d305290b7e86ae8fef3fb8e5c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });var elementProto = window.HTMLElement.prototype;
  var matchesSelector = elementProto.matches || elementProto.msMatchesSelector || elementProto.webkitMatchesSelector || elementProto.mozMatchesSelector || elementProto.oMatchesSelector;
  
  exports['default'] = {
    value: function value(selector) {
      return this.nodeType === 1 && matchesSelector.call(this.__element, selector);
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/next-sibling.js
__5b5cbbda435ceecde2e873d0e2809940 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);
  
  exports['default'] = {
    get: _decide2['default'](function (data) {
      return data.node.nextSibling;
    }, function (data) {
      return data.node.nextSibling;
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/html-of.js
__f096680b7aa20852d5521fc36259a043 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = htmlOf;var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  
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
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/outer-html.js
__ed5315016b175d6bb3df88a23c1618f7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _htmlOf = __f096680b7aa20852d5521fc36259a043;
  
  var _htmlOf2 = _interopRequireDefault(_htmlOf);exports['default'] = {
    get: function get() {
      return _htmlOf2['default'](this);
    },
  
    set: function set(outerHTML) {
      this.__element.outerHTML = outerHTML;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/parent-node.js
__cfc5a9b45cdf9244c9692497bad0787e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    get: function get() {
      return this.__element.parentNode.__wrapper;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/previous-sibling.js
__904b6ca435cee850b847541458004909 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);
  
  exports['default'] = {
    get: _decide2['default'](function (data) {
      return data.node.previousSibling;
    }, function (data) {
      return data.node.previousSibling;
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/readonly.js
__ca3cbd8bce83779dc688966e5396aa85 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _property = __25bbe2a4faa9a7b273ac588055e7157d;
  
  var _property2 = _interopRequireDefault(_property);exports['default'] = function (child, name, value) {
    _property2['default'](child, name, {
      get: function get() {
        return value;
      }
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/remove-child.js
__1608906990ce448dd1b582b1e451d224 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _decide = __82323c269111294e19265f0584377c01;
  
  var _decide2 = _interopRequireDefault(_decide);
  
  var _readonly = __ca3cbd8bce83779dc688966e5396aa85;
  
  var _readonly2 = _interopRequireDefault(_readonly);exports['default'] = {
    value: _decide2['default'](function (data) {
      var childNode = data.args[0].__element;
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
      var removed = false;
  
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
  
        if (contentNode.container === childNode.parentNode) {
          contentNode.container.removeChild(childNode);
          removed = true;
        }
  
        if (contentNode.startNode.nextSibling === contentNode.endNode) {
          _content2['default'].addDefault(contentNode);
        }
  
        if (removed) {
          break;
        }
      }
  
      if (!removed) {
        throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
      }
  
      return childNode;
    }, function (data) {
      return this.__element.removeChild(data.args[0]);
    })
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/remove.js
__14476ad7d44208b4ceadd28b16a2e596 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = function () {
    var parent = this.parentNode;
    return parent && parent.removeChild(this);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/replace-child.js
__c15f6a7be82542ded22a90bc1807bbae = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);exports['default'] = {
    value: function value(newChild, oldChild) {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
  
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
  
        if (contentNode.container === oldChild.parentNode) {
          contentNode.container.replaceChild(newChild, oldChild);
          break;
        }
      }
  
      return this;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/text-content.js
__5d83602993d1bbdaad38b3476f1e8737 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _wrapped = __cefeb6c44c336fdd28876dc2cec99415;
  
  var _wrapped2 = _interopRequireDefault(_wrapped);exports['default'] = {
    get: function get() {
      return this.__element.textContent;
    },
  
    set: function set(textContent) {
      if (!_wrapped2['default'](this)) {
        return this.__element.textContent = textContent;
      }
  
      var acceptsTextContent;
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
  
      // Removes all nodes (including default content).
      this.innerHTML = '';
  
      // Find the first content node without a selector.
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
  
        if (!contentNode.selector) {
          acceptsTextContent = contentNode;
          break;
        }
      }
  
      // There may be no content nodes that accept text content.
      if (acceptsTextContent) {
        if (textContent) {
          _content2['default'].removeDefault(acceptsTextContent);
          acceptsTextContent.container.insertBefore(document.createTextNode(textContent), acceptsTextContent.endNode);
        } else {
          _content2['default'].addDefault(acceptsTextContent);
        }
      }
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/index.js
__5dda2670a6c6ddd93070ee1716de3b91 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _apiUnwrap = __4bbc0370540a5383d67c35e46b29b926;
  
  var _apiUnwrap2 = _interopRequireDefault(_apiUnwrap);
  
  var _apiWrap = __2bf9938321c0852e2197e9ec5e7b5b21;
  
  var _apiWrap2 = _interopRequireDefault(_apiWrap);
  
  var _apiWrapped = __cefeb6c44c336fdd28876dc2cec99415;
  
  var _apiWrapped2 = _interopRequireDefault(_apiWrapped);
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);
  
  var _mixin = __125890a9273e80bd87d26767cffe1164;
  
  var _mixin2 = _interopRequireDefault(_mixin);
  
  var _wrapAppendChild = __0e3ab07e564369cb50c217a40c5153b9;
  
  var _wrapAppendChild2 = _interopRequireDefault(_wrapAppendChild);
  
  var _wrapChildNodes = __a47b51ebb809469e3e4f3e37b30c8679;
  
  var _wrapChildNodes2 = _interopRequireDefault(_wrapChildNodes);
  
  var _wrapChildren = __ded42f60d281914c4dbaf7d9b268e729;
  
  var _wrapChildren2 = _interopRequireDefault(_wrapChildren);
  
  var _wrapGetElementsByTagName = __0aba65d9734ef3ff590bbd491fea85f8;
  
  var _wrapGetElementsByTagName2 = _interopRequireDefault(_wrapGetElementsByTagName);
  
  var _wrapInnerHTML = __221f2303ac1c3e63084bc2f7a59450f3;
  
  var _wrapInnerHTML2 = _interopRequireDefault(_wrapInnerHTML);
  
  var _wrapInsertAdjacentHTML = __aa76ad923873788370a073d5b4f922ee;
  
  var _wrapInsertAdjacentHTML2 = _interopRequireDefault(_wrapInsertAdjacentHTML);
  
  var _wrapInsertBefore = __d25c541b4b60e1c1fac0d397e97f283a;
  
  var _wrapInsertBefore2 = _interopRequireDefault(_wrapInsertBefore);
  
  var _wrapFirstChild = __53deeeb529258e755449195071912bf8;
  
  var _wrapFirstChild2 = _interopRequireDefault(_wrapFirstChild);
  
  var _wrapLastChild = __a49769da5b63824d5560db509487733c;
  
  var _wrapLastChild2 = _interopRequireDefault(_wrapLastChild);
  
  var _wrapMatches = __a44fc57d305290b7e86ae8fef3fb8e5c;
  
  var _wrapMatches2 = _interopRequireDefault(_wrapMatches);
  
  var _wrapNextSibling = __5b5cbbda435ceecde2e873d0e2809940;
  
  var _wrapNextSibling2 = _interopRequireDefault(_wrapNextSibling);
  
  var _wrapOuterHTML = __ed5315016b175d6bb3df88a23c1618f7;
  
  var _wrapOuterHTML2 = _interopRequireDefault(_wrapOuterHTML);
  
  var _wrapParentNode = __cfc5a9b45cdf9244c9692497bad0787e;
  
  var _wrapParentNode2 = _interopRequireDefault(_wrapParentNode);
  
  var _wrapPreviousSibling = __904b6ca435cee850b847541458004909;
  
  var _wrapPreviousSibling2 = _interopRequireDefault(_wrapPreviousSibling);
  
  var _wrapRemoveChild = __1608906990ce448dd1b582b1e451d224;
  
  var _wrapRemoveChild2 = _interopRequireDefault(_wrapRemoveChild);
  
  var _wrapRemove = __14476ad7d44208b4ceadd28b16a2e596;
  
  var _wrapRemove2 = _interopRequireDefault(_wrapRemove);
  
  var _wrapReplaceChild = __c15f6a7be82542ded22a90bc1807bbae;
  
  var _wrapReplaceChild2 = _interopRequireDefault(_wrapReplaceChild);
  
  var _wrapTextContent = __5d83602993d1bbdaad38b3476f1e8737;
  
  var _wrapTextContent2 = _interopRequireDefault(_wrapTextContent);var nodeProto = window.Node.prototype;
  var nodeMembers = {
    appendChild: _wrapAppendChild2['default'],
    childNodes: _wrapChildNodes2['default'],
    children: _wrapChildren2['default'],
    firstChild: _wrapFirstChild2['default'],
    lastChild: _wrapLastChild2['default'],
    getElementsByTagName: _wrapGetElementsByTagName2['default'],
    innerHTML: _wrapInnerHTML2['default'],
    insertAdjacentHTML: _wrapInsertAdjacentHTML2['default'],
    insertBefore: _wrapInsertBefore2['default'],
    matches: _wrapMatches2['default'],
    nextSibling: _wrapNextSibling2['default'],
    outerHTML: _wrapOuterHTML2['default'],
    parentNode: _wrapParentNode2['default'],
    previousSibling: _wrapPreviousSibling2['default'],
    removeChild: _wrapRemoveChild2['default'],
    replaceChild: _wrapReplaceChild2['default'],
    remove: _wrapRemove2['default'],
    textContent: _wrapTextContent2['default']
  };
  
  // Define members that will proxy the real element's properties.
  ['attributes', 'nodeName', 'nodeType', 'nodeValue', 'tagName'].forEach(function (property) {
    nodeMembers[property] = {
      get: function get() {
        return this.__element[property];
      }
    };
  });
  
  ['getAttribute', 'setAttribute'].forEach(function (method) {
    nodeMembers[method] = {
      value: function value() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        var el = this.__element;
        return el[method].apply(el, args);
      }
    };
  });
  
  // Property that ensures the element is always returned. Allows `.__element` to
  // be called on a real node, or a wrapper without having to check.
  Object.defineProperty(nodeProto, '__element', {
    get: function get() {
      return this;
    }
  });
  
  // Define an accessor to get a wrapped version of an element.
  Object.defineProperty(nodeProto, '__wrapper', {
    get: function get() {
      if (!this.___wrapper) {
        this.___wrapper = _mixin2['default']({}, nodeMembers);
        this.___wrapper.__element = this;
        this.___wrapper.__wrapper = this.___wrapper;
      }
  
      return this.___wrapper;
    }
  });
  
  // Override DOM manipulators to ensure a real DOM element is passed in instead
  // of a wrapper.
  var oldAppendChild = nodeProto.appendChild;
  nodeProto.appendChild = function (node) {
    return oldAppendChild.call(this.__element, node.__element);
  };
  var oldInsertBefore = nodeProto.insertBefore;
  nodeProto.insertBefore = function (node, reference) {
    return oldInsertBefore.call(this.__element, node.__element, reference && reference.__element);
  };
  var oldRemoveChild = nodeProto.removeChild;
  nodeProto.removeChild = function (node) {
    return oldRemoveChild.call(this.__element, node.__element);
  };
  var oldReplaceChild = nodeProto.replaceChild;
  nodeProto.replaceChild = function (node, reference) {
    return oldReplaceChild.call(this.__element, node.__element, reference.__element);
  };
  
  // Override `document.createElement()` to provide a wrapped node.
  var oldCreateElement = document.createElement.bind(document);
  document.createElement = function (name, parent) {
    return (parent ? oldCreateElement(name, parent) : oldCreateElement(name)).__wrapper;
  };
  
  // Public API
  function skateTemplateHtml() {
    var templateStr = [].slice.call(arguments).join('');
    var template = _fragment2['default'].fromString(templateStr);
  
    return function (target) {
      target = typeof target === 'string' ? _fragment2['default'].fromString(target).childNodes[0] : target;
  
      // There's an issue with passing in nodes that are already wrapped where we
      // must use their `innerHTML` rather than their `childNodes` as the light
      // DOM of the new shadow DOM being applied to the element.
      var frag = _fragment2['default'].fromNodeList(target.childNodes);
  
      skateTemplateHtml.unwrap(target);
      target.appendChild(template);
      _content2['default'].set(target, _content2['default'].data(target));
      skateTemplateHtml.wrap(target);
      _content2['default'].init(target);
  
      if (frag.childNodes.length) {
        target.appendChild(frag);
      }
  
      return target;
    };
  }
  
  skateTemplateHtml.unwrap = _apiUnwrap2['default'];
  skateTemplateHtml.wrap = _apiWrap2['default'];
  skateTemplateHtml.wrapped = _apiWrapped2['default'];
  
  exports['default'] = window.skateTemplateHtml = skateTemplateHtml;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);