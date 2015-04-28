// src/util/call.js
__9a4ed6133544b918e78ae75e2532a19a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = function (node, fn) {
    fn = node['__' + fn] || node[fn];
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return fn.apply(node, args);
    };
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
  
  var _call = __9a4ed6133544b918e78ae75e2532a19a;
  
  var _call2 = _interopRequireDefault(_call);var _default = (function () {
    var _class = function _default() {
      _classCallCheck(this, _class);
    };
  
    _createClass(_class, null, [{
      key: 'get',
      value: function get(element) {
        return element.__skatejs_template_html_content;
      }
    }, {
      key: 'set',
      value: function set(element, content) {
        element.__skatejs_template_html_content = content;
        return this;
      }
    }, {
      key: 'addDefault',
      value: function addDefault(content) {
        var nodes = content.defaultNodes;
        var nodesLen = nodes.length;
  
        for (var a = 0; a < nodesLen; a++) {
          _call2['default'](content.container, 'insertBefore')(nodes[a], content.endNode);
        }
  
        content.isDefault = true;
      }
    }, {
      key: 'removeDefault',
      value: function removeDefault(content) {
        var nodes = content.defaultNodes;
        var nodesLen = nodes.length;
  
        for (var a = 0; a < nodesLen; a++) {
          var node = nodes[a];
          _call2['default'](node.parentNode, 'removeChild')(node);
        }
  
        content.isDefault = false;
      }
    }]);
  
    return _class;
  })();
  
  exports['default'] = _default;
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
  
      while (nodeList && nodeList.length) {
        frag.appendChild(nodeList[0]);
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
      var div = document.createElement(tag && specialMap[tag[1]] || 'div');
  
      div.innerHTML = domString;
  
      return this.fromNodeList(div.childNodes);
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/fix/inner-html.js
__c41e208eb421052a6f8900284e102de7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);var elProtoInnerHTML = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML');
  
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
  
    for (var a = 0; a < childNodesLen; a++) {
      var childNode = childNodes[a];
      html += htmlOf(childNode);
    }
  
    html += '</' + tagName + '>';
  
    return html;
  }
  
  exports['default'] = {
    // Chrome doesn't report innerHTML properly using the original getter once
    // it's been overridden. This ensures that it uses the proper means to do so.
    // This may be because of some internal cache or something but it just doesn't
    // work.
    get: function get() {
      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;
  
      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += htmlOf(childNode);
      }
  
      return html;
    },
  
    // Webkit doesn't return anything when Object.getOwnPropertyDescriptor() is
    // called to get built-in accessors so we've got to fully re-implement
    // innerHTML if we can't get an accessor for it.
    set: function set(html) {
      if (elProtoInnerHTML) {
        elProtoInnerHTML.set.call(this, html);
        return;
      }
  
      var frag = _fragment2['default'].fromString(html);
      this.appendChild(frag);
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/find.js
__0bfffc9aa1fd87055e9e3c53faed6d18 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });var elProto = window.HTMLElement.prototype;
  var matchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
  
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
  
  var _call = __9a4ed6133544b918e78ae75e2532a19a;
  
  var _call2 = _interopRequireDefault(_call);
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _find = __0bfffc9aa1fd87055e9e3c53faed6d18;
  
  var _find2 = _interopRequireDefault(_find);exports['default'] = {
    value: function value(node) {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
  
      if (node instanceof window.DocumentFragment) {
        var fragChildNodes = node.childNodes;
  
        [].slice.call(fragChildNodes).forEach((function (node) {
          this.appendChild(node);
        }).bind(this));
  
        return this;
      }
  
      for (var b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var selector = contentNode.selector;
  
        if (!selector || _find2['default'].matches(node, selector)) {
          _content2['default'].removeDefault(contentNode);
          _call2['default'](contentNode.endNode.parentNode, 'insertBefore')(node, contentNode.endNode);
          break;
        }
      }
  
      return this;
    }
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
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _find = __0bfffc9aa1fd87055e9e3c53faed6d18;
  
  var _find2 = _interopRequireDefault(_find);exports['default'] = {
    get: function get() {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
      var nodes = [];
  
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
  
        if (contentNode.isDefault) {
          continue;
        }
  
        nodes = nodes.concat(_find2['default'].between(contentNode.startNode, contentNode.endNode));
      }
  
      return nodes;
    }
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
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;
      var children = [];
  
      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
  
        if (childNode.nodeType === 1) {
          children.push(childNode);
        }
      }
  
      return children;
    }
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
      var childNodes = this.childNodes;
      return childNodes.length && childNodes[0] || null;
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
  
  var _call = __9a4ed6133544b918e78ae75e2532a19a;
  
  var _call2 = _interopRequireDefault(_call);
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _find = __0bfffc9aa1fd87055e9e3c53faed6d18;
  
  var _find2 = _interopRequireDefault(_find);
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);exports['default'] = {
    get: function get() {
      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;
  
      for (var a = 0; a < childNodesLen; a++) {
        var childNode = childNodes[a];
        html += childNode.outerHTML || childNode.textContent;
      }
  
      return html;
    },
    set: function set(html) {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
      var targetFragment = _fragment2['default'].fromString(html);
  
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
        var childNodes = _find2['default'].between(contentNode.startNode, contentNode.endNode);
  
        // Remove all nodes (including default content).
        for (var b = 0; b < childNodes.length; b++) {
          var childNode = childNodes[b];
          _call2['default'](childNode.parentNode, 'removeChild')(childNode);
        }
  
        var foundNodes = _find2['default'].selector(targetFragment, contentNode.selector);
  
        // Add any matched nodes from the given HTML.
        for (var c = 0; c < foundNodes.length; c++) {
          _call2['default'](contentNode.container, 'insertBefore')(foundNodes[c], contentNode.endNode);
        }
  
        // If no nodes were found, set the default content.
        if (foundNodes.length) {
          _content2['default'].removeDefault(contentNode);
        } else {
          _content2['default'].addDefault(contentNode);
        }
      }
    }
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
      if (where === 'afterbegin') {
        this.insertBefore(_fragment2['default'].fromString(html), this.childNodes[0]);
      } else if (where === 'beforeend') {
        this.appendChild(_fragment2['default'].fromString(html));
      } else {
        this.__insertAdjacentHTML(where, html);
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
  
  var _call = __9a4ed6133544b918e78ae75e2532a19a;
  
  var _call2 = _interopRequireDefault(_call);
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _find = __0bfffc9aa1fd87055e9e3c53faed6d18;
  
  var _find2 = _interopRequireDefault(_find);exports['default'] = {
    value: function value(node, referenceNode) {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
  
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
        var betweenNodes = _find2['default'].between(contentNode.startNode, contentNode.endNode);
        var betweenNodesLen = betweenNodes.length;
  
        for (var c = 0; c < betweenNodesLen; c++) {
          var betweenNode = betweenNodes[c];
  
          if (betweenNode === referenceNode) {
            hasFoundReferenceNode = true;
          }
  
          if (hasFoundReferenceNode) {
            var selector = contentNode.selector;
  
            if (!selector || _find2['default'].matches(node, selector)) {
              _call2['default'](betweenNode.parentNode, 'insertBefore')(node, betweenNode);
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
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);exports['default'] = {
    get: function get() {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
  
      for (var a = contentNodesLen - 1; a > -1; a--) {
        var contentNode = contentNodes[a];
  
        if (contentNode.isDefault) {
          continue;
        }
  
        var childNodes = this.childNodes;
        var childNodesLen = childNodes.length;
  
        return childNodes[childNodesLen - 1];
      }
  
      return null;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/wrap/outer-html.js
__ed5315016b175d6bb3df88a23c1618f7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });exports['default'] = {
    get: function get() {
      var name = this.tagName.toLowerCase();
      var html = '<' + name;
      var attrs = this.attributes;
  
      if (attrs) {
        var attrsLength = attrs.length;
  
        for (var a = 0; a < attrsLength; a++) {
          var attr = attrs[a];
          html += ' ' + attr.nodeName + '="' + attr.nodeValue + '"';
        }
      }
  
      html += '>';
      html += this.innerHTML;
      html += '</' + name + '>';
  
      return html;
    }
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
  
  var _content2 = _interopRequireDefault(_content);exports['default'] = {
    value: function value(childNode) {
      var contentNodes = _content2['default'].get(this);
      var contentNodesLen = contentNodes.length;
      var removed = false;
  
      for (var a = 0; a < contentNodesLen; a++) {
        var contentNode = contentNodes[a];
  
        if (contentNode.container === childNode.parentNode) {
          contentNode.container.removeChild(childNode);
          removed = true;
          break;
        }
  
        if (contentNode.startNode.nextSibling === contentNode.endNode) {
          _content2['default'].addDefault(contentNode);
        }
      }
  
      if (!removed) {
        throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
      }
  
      return childNode;
    }
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
  
  var _content2 = _interopRequireDefault(_content);exports['default'] = {
    get: function get() {
      var textContent = '';
      var childNodes = this.childNodes;
      var childNodesLength = this.childNodes.length;
  
      for (var a = 0; a < childNodesLength; a++) {
        textContent += childNodes[a].textContent;
      }
  
      return textContent;
    },
    set: function set(textContent) {
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
  var defineDependencies = {
    "module": module,
    "exports": exports,
    "./util/content": __19ae81b353686d785b09cf84bda3c843,
    "./fix/inner-html": __c41e208eb421052a6f8900284e102de7,
    "./util/fragment": __d63a0d8055a792e36bedf197bb39b3a9,
    "./wrap/append-child": __0e3ab07e564369cb50c217a40c5153b9,
    "./wrap/child-nodes": __a47b51ebb809469e3e4f3e37b30c8679,
    "./wrap/children": __ded42f60d281914c4dbaf7d9b268e729,
    "./wrap/first-child": __53deeeb529258e755449195071912bf8,
    "./wrap/inner-html": __221f2303ac1c3e63084bc2f7a59450f3,
    "./wrap/insert-adjacent-html": __aa76ad923873788370a073d5b4f922ee,
    "./wrap/insert-before": __d25c541b4b60e1c1fac0d397e97f283a,
    "./wrap/last-child": __a49769da5b63824d5560db509487733c,
    "./wrap/outer-html": __ed5315016b175d6bb3df88a23c1618f7,
    "./wrap/remove-child": __1608906990ce448dd1b582b1e451d224,
    "./wrap/replace-child": __c15f6a7be82542ded22a90bc1807bbae,
    "./wrap/text-content": __5d83602993d1bbdaad38b3476f1e8737
  };
  var define = function defineReplacement(name, deps, func) {
    var rval;
    var type;
  
    func = [func, deps, name].filter(function (cur) { return typeof cur === 'function'; })[0];
    deps = [deps, name, []].filter(Array.isArray)[0];
    rval = func.apply(null, deps.map(function (value) { return defineDependencies[value]; }));
    type = typeof rval;
  
    // Some processors like Babel don't check to make sure that the module value
    // is not a primitive before calling Object.defineProperty() on it. We ensure
    // it is an instance so that it can.
    if (type === 'string') {
      rval = new String(rval);
    } else if (type === 'number') {
      rval = new Number(rval);
    } else if (type === 'boolean') {
      rval = new Boolean(rval);
    }
  
    // Reset the exports to the defined module. This is how we convert AMD to
    // CommonJS and ensures both can either co-exist, or be used separately. We
    // only set it if it is not defined because there is no object representation
    // of undefined, thus calling Object.defineProperty() on it would fail.
    if (rval !== undefined) {
      exports = module.exports = rval;
    }
  };
  define.amd = true;
  
  var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _content = __19ae81b353686d785b09cf84bda3c843;
  
  var _content2 = _interopRequireDefault(_content);
  
  var _fixInnerHTML = __c41e208eb421052a6f8900284e102de7;
  
  var _fixInnerHTML2 = _interopRequireDefault(_fixInnerHTML);
  
  var _fragment = __d63a0d8055a792e36bedf197bb39b3a9;
  
  var _fragment2 = _interopRequireDefault(_fragment);
  
  var _wrapAppendChild = __0e3ab07e564369cb50c217a40c5153b9;
  
  var _wrapAppendChild2 = _interopRequireDefault(_wrapAppendChild);
  
  var _wrapChildNodes = __a47b51ebb809469e3e4f3e37b30c8679;
  
  var _wrapChildNodes2 = _interopRequireDefault(_wrapChildNodes);
  
  var _wrapChildren = __ded42f60d281914c4dbaf7d9b268e729;
  
  var _wrapChildren2 = _interopRequireDefault(_wrapChildren);
  
  var _wrapFirstChild = __53deeeb529258e755449195071912bf8;
  
  var _wrapFirstChild2 = _interopRequireDefault(_wrapFirstChild);
  
  var _wrapInnerHTML = __221f2303ac1c3e63084bc2f7a59450f3;
  
  var _wrapInnerHTML2 = _interopRequireDefault(_wrapInnerHTML);
  
  var _wrapInsertAdjacentHTML = __aa76ad923873788370a073d5b4f922ee;
  
  var _wrapInsertAdjacentHTML2 = _interopRequireDefault(_wrapInsertAdjacentHTML);
  
  var _wrapInsertBefore = __d25c541b4b60e1c1fac0d397e97f283a;
  
  var _wrapInsertBefore2 = _interopRequireDefault(_wrapInsertBefore);
  
  var _wrapLastChild = __a49769da5b63824d5560db509487733c;
  
  var _wrapLastChild2 = _interopRequireDefault(_wrapLastChild);
  
  var _wrapOuterHTML = __ed5315016b175d6bb3df88a23c1618f7;
  
  var _wrapOuterHTML2 = _interopRequireDefault(_wrapOuterHTML);
  
  var _wrapRemoveChild = __1608906990ce448dd1b582b1e451d224;
  
  var _wrapRemoveChild2 = _interopRequireDefault(_wrapRemoveChild);
  
  var _wrapReplaceChild = __c15f6a7be82542ded22a90bc1807bbae;
  
  var _wrapReplaceChild2 = _interopRequireDefault(_wrapReplaceChild);
  
  var _wrapTextContent = __5d83602993d1bbdaad38b3476f1e8737;
  
  var _wrapTextContent2 = _interopRequireDefault(_wrapTextContent);var elProto = window.Element.prototype;
  var fixes = {
    innerHTML: _fixInnerHTML2['default']
  };
  var wrapper = {
    appendChild: _wrapAppendChild2['default'],
    childNodes: _wrapChildNodes2['default'],
    children: _wrapChildren2['default'],
    firstChild: _wrapFirstChild2['default'],
    innerHTML: _wrapInnerHTML2['default'],
    insertAdjacentHTML: _wrapInsertAdjacentHTML2['default'],
    insertBefore: _wrapInsertBefore2['default'],
    lastChild: _wrapLastChild2['default'],
    outerHTML: _wrapOuterHTML2['default'],
    removeChild: _wrapRemoveChild2['default'],
    replaceChild: _wrapReplaceChild2['default'],
    textContent: _wrapTextContent2['default']
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
  
    _content2['default'].set(node, contentData);
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
      var frag = target.__wrapped ? _fragment2['default'].fromString(target.innerHTML) : _fragment2['default'].fromNodeList(target.childNodes);
  
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
  
    if (!_content2['default'].get(node)) {
      _content2['default'].set(node, parseNodeForContent(node));
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
  
  exports['default'] = skateTemplateHtml;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);