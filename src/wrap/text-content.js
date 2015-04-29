'use strict';

import content from '../util/content';

export default {
  get: function () {
    var textContent = '';
    var childNodes = this.childNodes;
    var childNodesLength = this.childNodes.length;

    for (let a = 0; a < childNodesLength; a++) {
      textContent += childNodes[a].textContent;
    }

    return textContent;
  },
  set: function (textContent) {
    var acceptsTextContent;
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;

    // Removes all nodes (including default content).
    this.innerHTML = '';

    // Find the first content node without a selector.
    for (let a = 0; a < contentNodesLen; a++) {
      let contentNode = contentNodes[a];

      if (!contentNode.selector) {
        acceptsTextContent = contentNode;
        break;
      }
    }

    // There may be no content nodes that accept text content.
    if (acceptsTextContent) {
      if (textContent) {
        content.removeDefault(acceptsTextContent);
        acceptsTextContent.container.insertBefore(document.createTextNode(textContent), acceptsTextContent.endNode);
      } else {
        content.addDefault(acceptsTextContent);
      }
    }
  }
};
