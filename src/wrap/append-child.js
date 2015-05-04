'use strict';

import content from '../util/content';

export default {
  value: function (node) {
    if (!this.__wrapped) {
      return this.__node.appendChild(node);
    }

    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
    var that = this;

    if (node instanceof window.DocumentFragment) {
      let fragChildNodes = node.childNodes;

      [].slice.call(fragChildNodes).forEach(function (node) {
        that.appendChild(node);
      });

      return this;
    }

    for (let b = 0; b < contentNodesLen; b++) {
      let contentNode = contentNodes[b];
      let selector = contentNode.selector;

      if (!selector || node.__wrapper.matches(selector)) {
        content.removeDefault(contentNode);
        contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
        break;
      }
    }

    return this;
  }
};
