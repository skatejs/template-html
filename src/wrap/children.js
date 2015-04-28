'use strict';

export default {
  get: function () {
    var childNodes = this.childNodes;
    var childNodesLen = childNodes.length;
    var children = [];

    for (var a = 0; a < childNodesLen; a++) {
      let childNode = childNodes[a];

      if (childNode.nodeType === 1) {
        children.push(childNode);
      }
    }

    return children;
  }
};
