'use strict';

import content from '../util/content';
import find from '../util/find';

export default {
  get: function () {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
    var nodes = [];

    for (var a = 0; a < contentNodesLen; a++) {
      var contentNode = contentNodes[a];

      if (contentNode.isDefault) {
        continue;
      }

      nodes = nodes.concat(find.between(contentNode.startNode, contentNode.endNode));
    }

    return nodes;
  }
};
