'use strict';

import content from '../util/content';

export default {
  get: function () {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;

    for (let a = contentNodesLen - 1; a > -1; a--) {
      let contentNode = contentNodes[a];

      if (contentNode.isDefault) {
        continue;
      }

      let childNodes = this.childNodes;
      let childNodesLen = childNodes.length;

      return childNodes[childNodesLen - 1];
    }

    return null;
  }
};
