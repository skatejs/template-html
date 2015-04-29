'use strict';

import call from '../util/call';
import content from '../util/content';

export default {
  value: function (childNode) {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
    var removed = false;

    alert('called');

    if (!contentNodesLen) {
      return this.__removeChild(childNode);
    }

    for (let a = 0; a < contentNodesLen; a++) {
      let contentNode = contentNodes[a];

      if (contentNode.container === childNode.parentNode) {
        call(contentNode.container, 'removeChild')(childNode);
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
