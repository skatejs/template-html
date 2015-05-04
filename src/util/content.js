'use strict';

import fragment from './fragment';

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

export default class {
  static get (element) {
    return element.__node.__skateTemplateHtmlContent;
  }

  static set (element, content) {
    element.__node.__skateTemplateHtmlContent = content;
    return this;
  }

  static init (element) {
    var that = this;
    this.get(element).forEach(function (content) {
      that.addDefault(content);
    });
    return this;
  }

  static data (node) {
    node = node.__node;
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

  static parse (node) {
    node = node.__node;
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
              defaultNodes: contentInfo.data.defaultContent && fragment.fromString(contentInfo.data.defaultContent).childNodes || [],
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

  static addDefault (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (let a = 0; a < nodesLen; a++) {
      content.container.__node.insertBefore(nodes[a], content.endNode);
    }

    content.isDefault = true;
    return this;
  }

  static removeDefault (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      let node = nodes[a];
      node.parentNode.__node.removeChild(node);
    }

    content.isDefault = false;
    return this;
  }
}
