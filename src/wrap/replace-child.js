'use strict';

import content from '../util/content';

export default {
  value: function (newChild, oldChild) {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;

    for (var a = 0; a < contentNodesLen; a++) {
      var contentNode = contentNodes[a];

      if (contentNode.container === oldChild.parentNode) {
        contentNode.container.replaceChild(newChild, oldChild);
        break;
      }
    }

    return this;
  }
};
