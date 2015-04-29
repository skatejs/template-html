'use strict';

import call from '../util/call';
import content from '../util/content';
import fixTextContent from '../fix/text-content';

export default {
  get: fixTextContent.get,
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
        call(acceptsTextContent.container, 'insertBefore')(document.createTextNode(textContent), acceptsTextContent.endNode);
      } else {
        content.addDefault(acceptsTextContent);
      }
    }
  }
};
