'use strict';

import content from '../util/content';

export default {
  get: function () {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;

    for (var a = contentNodesLen - 1; a > -1; a--) {
      var contentNode = contentNodes[a];

      if (contentNode.isDefault) {
        continue;
      }

      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;

      return childNodes[childNodesLen - 1];
    }

    return null;
  }
};
