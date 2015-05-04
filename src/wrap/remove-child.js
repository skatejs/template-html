'use strict';

import content from '../util/content';

export default {
  value: function (childNode) {
    if (!this.__wrapped) {
      return this.__node.removeChild(childNode);
    }

    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
    var realParentNode = childNode.parentNode.__node;
    var removed = false;

    for (let a = 0; a < contentNodesLen; a++) {
      let contentNode = contentNodes[a];

      if (contentNode.container === realParentNode) {
        contentNode.container.removeChild(childNode);
        removed = true;
      }

      if (contentNode.startNode.nextSibling === contentNode.endNode) {
        content.addDefault(contentNode);
      }

      if (removed) {
        break;
      }
    }

    if (!removed) {
      throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
    }

    return childNode;
  }
};
