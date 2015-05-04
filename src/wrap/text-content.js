'use strict';

import content from '../util/content';

export default {
  get: function () {
    return this.__node.textContent;
  },

  set: function (textContent) {
    if (!this.__wrapped) {
      this.__node.textContent = textContent;
      return;
    }

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
