'use strict';

import content from '../util/content';

export default {
  value: function (childNode) {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
    var removed = false;

    for (let a = 0; a < contentNodesLen; a++) {
      let contentNode = contentNodes[a];

      if (contentNode.container === childNode.parentNode) {
        contentNode.container.removeChild(childNode);
        removed = true;
        break;
      }

      if (contentNode.startNode.nextSibling === contentNode.endNode) {
        content.addDefault(contentNode);
      }
    }

    if (!removed) {
      throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
    }

    return childNode;
  }
};
