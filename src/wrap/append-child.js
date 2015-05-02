'use strict';

import content from '../util/content';
import decide from '../util/decide';

export default {
  value: decide(
    function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var node = data.args[0];
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
    },

    function (data) {
      return data.node.appendChild(data.args[0]);
    }
  )
};
