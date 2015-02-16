(function () {
  'use strict';

  var DocumentFragment = window.DocumentFragment;
  var elProto = window.HTMLElement.prototype;
  var matchesSelector = (
    elProto.matches ||
    elProto.msMatchesSelector ||
    elProto.webkitMatchesSelector ||
    elProto.mozMatchesSelector ||
    elProto.oMatchesSelector
  );

  function getData (element, name) {
    if (element.__SKATE_TEMPLATE_HTML_DATA) {
      return element.__SKATE_TEMPLATE_HTML_DATA[name];
    }
  }

  function setData (element, name, value) {
    if (!element.__SKATE_TEMPLATE_HTML_DATA) {
      element.__SKATE_TEMPLATE_HTML_DATA = {};
    }

    element.__SKATE_TEMPLATE_HTML_DATA[name] = value;

    return element;
  }

  function createFragmentFromString (domString) {
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

    return createFragmentFromNodeList(div.childNodes);
  }

  function createFragmentFromNodeList (nodeList) {
    var frag = document.createDocumentFragment();

    while (nodeList && nodeList.length) {
      frag.appendChild(nodeList[0]);
    }

    return frag;
  }

  function getNodesBetween (startNode, endNode) {
    var nodes = [];
    var nextNode = startNode.nextSibling;

    while (nextNode !== endNode) {
      nodes.push(nextNode);
      nextNode = nextNode.nextSibling;
    }

    return nodes;
  }

  function findChildrenMatchingSelector (sourceNode, selector) {
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
  }

  function htmlTemplateParentWrapper (element) {
    var contentNodes = getData(element, 'content');
    var contentNodesLen = contentNodes.length;

    return {
      childNodes: {
        get: function () {
          var nodes = [];

          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];

            if (contentNode.isDefault) {
              continue;
            }

            nodes = nodes.concat(getNodesBetween(contentNode.startNode, contentNode.endNode));
          }

          return nodes;
        }
      },

      firstChild: {
        get: function () {
          var childNodes = this.childNodes;
          return childNodes.length && childNodes[0] || null;
        }
      },

      innerHTML: {
        get: function () {
          var html = '';
          var childNodes = this.childNodes;
          var childNodesLen = childNodes.length;

          for (var a = 0; a < childNodesLen; a++) {
            var childNode = childNodes[a];
            html += childNode.outerHTML || childNode.textContent;
          }

          return html;
        },
        set: function (html) {
          var targetFragment = createFragmentFromString(html);

          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];
            var childNodes = getNodesBetween(contentNode.startNode, contentNode.endNode);

            // Remove all nodes (including default content).
            for (var b = 0; b < childNodes.length; b++) {
              var childNode = childNodes[b];
              childNode.parentNode.removeChild(childNode);
            }

            var foundNodes = findChildrenMatchingSelector(targetFragment, contentNode.selector);

            // Add any matched nodes from the given HTML.
            for (var c = 0; c < foundNodes.length; c++) {
              contentNode.container.insertBefore(foundNodes[c], contentNode.endNode);
            }

            // If no nodes were found, set the default content.
            if (foundNodes.length) {
              removeDefaultContent(contentNode);
            } else {
              addDefaultContent(contentNode);
            }
          }
        }
      },

      lastChild: {
        get: function () {
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
      },

      outerHTML: {
        get: function () {
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
      },

      textContent: {
        get: function () {
          var textContent = '';
          var childNodes = this.childNodes;
          var childNodesLength = this.childNodes.length;

          for (var a = 0; a < childNodesLength; a++) {
            textContent += childNodes[a].textContent;
          }

          return textContent;
        },
        set: function (textContent) {
          var acceptsTextContent;

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
              removeDefaultContent(acceptsTextContent);
              acceptsTextContent.container.insertBefore(document.createTextNode(textContent), acceptsTextContent.endNode);
            } else {
              addDefaultContent(acceptsTextContent);
            }
          }
        }
      },

      appendChild: {
        value: function (node) {
          if (node instanceof DocumentFragment) {
            var fragChildNodes = node.childNodes;

            [].slice.call(fragChildNodes).forEach(function (node) {
              this.appendChild(node);
            }.bind(this));

            return this;
          }

          for (var b = 0; b < contentNodesLen; b++) {
            var contentNode = contentNodes[b];
            var contentSelector = contentNode.selector;

            if (!contentSelector || node instanceof window.HTMLElement && matchesSelector.call(node, contentSelector)) {
              removeDefaultContent(contentNode);
              contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
              break;
            }
          }

          return this;
        }
      },

      insertAdjacentHTML: {
        value: function (where, html) {
          if (where === 'afterbegin') {
            this.insertBefore(createFragmentFromString(html), this.childNodes[0]);
          } else if (where === 'beforeend') {
            this.appendChild(createFragmentFromString(html));
          } else {
            element.insertAdjacentHTML(where, html);
          }

          return this;
        }
      },

      insertBefore: {
        value: function (node, referenceNode) {
          // If no reference node is supplied, we append. This also means that we
          // don't need to add / remove any default content because either there
          // aren't any nodes or appendChild will handle it.
          if (!referenceNode) {
            return this.appendChild(node);
          }

          // Handle document fragments.
          if (node instanceof DocumentFragment) {
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
          mainLoop:
          for (var b = 0; b < contentNodesLen; b++) {
            var contentNode = contentNodes[b];
            var betweenNodes = getNodesBetween(contentNode.startNode, contentNode.endNode);
            var betweenNodesLen = betweenNodes.length;

            for (var c = 0; c < betweenNodesLen; c++) {
              var betweenNode = betweenNodes[c];

              if (betweenNode === referenceNode) {
                hasFoundReferenceNode = true;
              }

              if (hasFoundReferenceNode) {
                var selector = contentNode.selector;

                if (!selector || matchesSelector.call(node, selector)) {
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
        }
      },

      removeChild: {
        value: function (childNode) {
          var removed = false;

          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];

            if (contentNode.container === childNode.parentNode) {
              contentNode.container.removeChild(childNode);
              removed = true;
              break;
            }

            if (contentNode.startNode.nextSibling === contentNode.endNode) {
              addDefaultContent(contentNode);
            }
          }

          if (!removed) {
            throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
          }

          return childNode;
        }
      },

      replaceChild: {
        value: function (newChild, oldChild) {
          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];

            if (contentNode.container === oldChild.parentNode) {
              contentNode.container.replaceChild(newChild, oldChild);
              break;
            }
          }

          return this;
        }
      }
    };
  }

  function addDefaultContent (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      content.container.insertBefore(nodes[a], content.endNode);
    }

    content.isDefault = true;
  }

  function removeDefaultContent (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      var node = nodes[a];
      node.parentNode.removeChild(node);
    }

    content.isDefault = false;
  }

  function createProxyProperty (node, name) {
    return {
      get: function () {
        var value = node[name];

        if (typeof value === 'function') {
          return value.bind(node);
        }

        return value;
      },

      set: function (value) {
        node[name] = value;
      }
    };
  }

  function wrapNodeWith (node, wrapper) {
    var wrapped = {};

    for (var name in node) {
      var inWrapper = name in wrapper;

      if (inWrapper) {
        Object.defineProperty(wrapped, name, wrapper[name]);
      } else {
        Object.defineProperty(wrapped, name, createProxyProperty(node, name));
      }
    }

    return wrapped;
  }

  function cacheContentData (node) {
    var contentNodes = node.getElementsByTagName('content');
    var contentNodesLen = contentNodes && contentNodes.length;

    if (contentNodesLen) {
      var contentData = [];

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

      setData(node, 'content', contentData);
    }
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
              defaultNodes: contentInfo.data.defaultContent && createFragmentFromString(contentInfo.data.defaultContent).childNodes || [],
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
      var frag = createFragmentFromNodeList(target.childNodes);

      target.innerHTML = template;
      cacheContentData(target);

      if (frag.childNodes.length) {
        skateTemplateHtml.wrap(target).appendChild(frag);
      }
    };
  }

  skateTemplateHtml.wrap = function (node) {
    if (!getData(node, 'content')) {
      setData(node, 'content', parseNodeForContent(node));
    }

    return wrapNodeWith(node, htmlTemplateParentWrapper(node));
  };



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
})();
