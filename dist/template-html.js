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



  /**
   * Adds data to the element.
   *
   * @param {Element} element The element to get data from.
   * @param {String} name The name of the data to return.
   *
   * @returns {Mixed}
   */
  function getData (element, name) {
    if (element.__SKATE_TEMPLATE_HTML_DATA) {
      return element.__SKATE_TEMPLATE_HTML_DATA[name];
    }
  }

  /**
   * Adds data to the element.
   *
   * @param {Element} element The element to apply data to.
   * @param {String} name The name of the data.
   * @param {Mixed} value The data value.
   *
   * @returns {undefined}
   */
  function setData (element, name, value) {
    if (!element.__SKATE_TEMPLATE_HTML_DATA) {
      element.__SKATE_TEMPLATE_HTML_DATA = {};
    }

    element.__SKATE_TEMPLATE_HTML_DATA[name] = value;

    return element;
  }

  /**
   * Creates a document fragment from the specified DOM string. It ensures that
   * if special nodes are passed in that they are added to a valid parent node
   * before importing to the document fragment.
   *
   * @param {String} domString The HTMl to create a fragment from.
   *
   * @returns {DocumentFragment}
   */
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

    var frag = document.createDocumentFragment();
    var tag = domString.match(/\s*<([^\s>]+)/);
    var div = document.createElement(tag && specialMap[tag[1]] || 'div');

    div.innerHTML = domString;

    return createFragmentFromNodeList(div.childNodes);
  }

  /**
   * Creates a document fragment from an element's childNodes.
   *
   * @param {NodeList} nodeList
   */
  function createFragmentFromNodeList (nodeList) {
    var frag = document.createDocumentFragment();

    while (nodeList && nodeList.length) {
      frag.appendChild(nodeList[0]);
    }

    return frag;
  }

  /**
   * Returns the nodes between the start node and the end node.
   *
   * @param {Node} startNode The start node.
   * @param {Node} endNode The end node.
   *
   * @returns {Array}
   */
  function getNodesBetween (startNode, endNode) {
    var nodes = [];
    var nextNode = startNode.nextSibling;

    while (nextNode !== endNode) {
      nodes.push(nextNode);
      nextNode = nextNode.nextSibling;
    }

    return nodes;
  }

  /**
   * Finds direct children in the `sourceNode` that match the given selector.
   *
   * @param {Element} sourceNode The node to find the elements in.
   * @param {String} selector The selector to use. If not specified, all
   *                          `childNodes` are returned.
   *
   * @returns {NodeList}
   */
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

  /**
   * Returns an object with methods and properties that can be used to wrap an
   * element so that it behaves similar to a shadow root.
   *
   * @param {HTMLElement} element The original element to wrap.
   *
   * @returns {Object}
   */
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

      appendChild: function (node) {
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

          if (!contentSelector || matchesSelector.call(node, contentSelector)) {
            removeDefaultContent(contentNode);
            contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
            break;
          }
        }

        return this;
      },

      insertAdjacentHTML: function (where, html) {
        if (where === 'afterbegin') {
          this.insertBefore(createFragmentFromString(html), this.childNodes[0]);
        } else if (where === 'beforeend') {
          this.appendChild(createFragmentFromString(html));
        } else {
          element.insertAdjacentHTML(where, html);
        }

        return this;
      },

      insertBefore: function (node, referenceNode) {
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
      },

      removeChild: function (childNode) {
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
      },

      replaceChild: function (newChild, oldChild) {
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
  }

  /**
   * Adds the default content if no content exists.
   *
   * @param {Object} content The content data.
   *
   * @returns {undefined}
   */
  function addDefaultContent (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      content.container.insertBefore(nodes[a], content.endNode);
    }

    content.isDefault = true;
  }

  /**
   * Removes the default content if it exists.
   *
   * @param {Object} content The content data.
   *
   * @returns {undefined}
   */
  function removeDefaultContent (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      var node = nodes[a];
      node.parentNode.removeChild(node);
    }

    content.isDefault = false;
  }

  /**
   * Returns a property definition that just proxies to the original element
   * property.
   *
   * @param {Node} node The node to proxy to.
   * @param {String} name The name of the property.
   */
  function createProxyProperty (node, name) {
    return {
      get: function () {
        return node[name];
      },
      set: function (value) {
        node[name] = value;
      }
    };
  }

  /**
   * Wraps the specified element with the given wrapper.
   *
   * @param {Object} wrapper The methods and properties to wrap.
   *
   * @returns {Node}
   */
  function wrapNodeWith (node, wrapper) {
    var wrapped = {};

    for (var name in node) {
      var inWrapper = name in wrapper;

      if (typeof node[name] === 'function') {
        wrapped[name] = inWrapper ? wrapper[name] : node[name].bind(node);
      } else if (inWrapper) {
        Object.defineProperty(wrapped, name, wrapper[name]);
      } else {
        Object.defineProperty(wrapped, name, createProxyProperty(node, name));
      }
    }

    return wrapped;
  }

  /**
   * Caches information about the content nodes.
   *
   * @param {Node} node The node to cache content information about.
   *
   * @returns {undefined}
   */
  function cacheContentData (node) {
    var contentNodes = node.getElementsByTagName('content');
    var contentNodesLen = contentNodes && contentNodes.length;

    if (contentNodesLen) {
      var contentData = [];

      while (contentNodes.length) {
        var contentNode = contentNodes[0];
        var parentNode = contentNode.parentNode;
        var startNode = document.createComment('');
        var endNode = document.createComment('');

        contentData.push({
          container: parentNode,
          contentNode: contentNode,
          defaultNodes: [].slice.call(contentNode.childNodes),
          endNode: endNode,
          isDefault: true,
          selector: contentNode.getAttribute('select'),
          startNode: startNode
        });

        parentNode.replaceChild(endNode, contentNode);
        parentNode.insertBefore(startNode, endNode);
      }

      setData(node, 'content', contentData);
    }
  }



  // Public API
  // ----------

  /**
   * Default template renderer. Similar to ShadowDOM style templating where
   * content is projected from the light DOM.
   *
   * Differences:
   *
   * - Uses a `data-skate-content` attribute instead of a `select` attribute.
   * - Attribute is applied to existing elements rather than the <content>
   *   element to prevent styling issues.
   * - Does not dynamically project modifications to the root custom element.
   *   You must affect each projection node.
   *
   * Usage:
   *
   *     var tmp = skateTemplateHtml('<my-html-template data-skate-content=".select-some-children"></my-html-template>');
   *     tmp(elementToTemplate);
   *
   * @returns {Function} The function for rendering the template.
   */
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

  /**
   * Wraps the element in an object that has methods which can be used to
   * manipulate the content similar to if it were delcared as the shadow root.
   *
   * @param {Node} node The node to wrap.
   *
   * @returns {Object}
   */
  skateTemplateHtml.wrap = function (node) {
    return getData(node, 'content') ?
      wrapNodeWith(node, htmlTemplateParentWrapper(node)) :
      node;
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
