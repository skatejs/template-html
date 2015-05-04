'use strict';

import content from '../util/content';
import decide from '../util/decide';
import readonly from '../util/readonly';

export default {
  value: decide(
    function (data) {
      var childNode = data.args[0].__node;
      var contentNodes = content.get(this);
      var contentNodesLen = contentNodes.length;
      var removed = false;

      for (let a = 0; a < contentNodesLen; a++) {
        let contentNode = contentNodes[a];

        if (contentNode.container === childNode.parentNode) {
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
    },

    function (data) {
      return this.__node.removeChild(data.args[0]);
    }
  )
};
