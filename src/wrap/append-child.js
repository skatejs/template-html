'use strict';

import call from '../util/call';
import content from '../util/content';
import find from '../util/find';

export default {
  value: function (node) {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;

    if (node instanceof window.DocumentFragment) {
      let fragChildNodes = node.childNodes;

      [].slice.call(fragChildNodes).forEach(function (node) {
        this.appendChild(node);
      }.bind(this));

      return this;
    }

    for (let b = 0; b < contentNodesLen; b++) {
      let contentNode = contentNodes[b];
      let selector = contentNode.selector;

      if (!selector || find.matches(node, selector)) {
        content.removeDefault(contentNode);
        call(contentNode.endNode.parentNode, 'insertBefore')(node, contentNode.endNode);
        break;
      }
    }

    return this;
  }
};
