'use strict';

import content from '../util/content';
import decide from '../util/decide';
import query from '../util/query';
import fragment from '../util/fragment';

export default {
  get: decide(
    function () {
      var html = '';
      var childNodes = this.childNodes;
      var childNodesLen = childNodes.length;

      for (let a = 0; a < childNodesLen; a++) {
        let childNode = childNodes[a];
        html += childNode.outerHTML || childNode.textContent;
      }

      return html;
    },

    function (data) {
      return data.node.innerHTML;
    }
  ),

  set: decide(
    function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var html = data.args[0];
      var targetFragment = fragment.fromString(html);

      for (let a = 0; a < contentNodesLen; a++) {
        let contentNode = contentNodes[a];
        let childNodes = query.between(contentNode.startNode, contentNode.endNode);

        // Remove all nodes (including default content).
        for (let b = 0; b < childNodes.length; b++) {
          let childNode = childNodes[b];
          childNode.parentNode.removeChild(childNode);
        }

        let foundNodes = query.selector(targetFragment, contentNode.selector);

        // Add any matched nodes from the given HTML.
        for (let c = 0; c < foundNodes.length; c++) {
          let node = foundNodes[c];
          contentNode.container.insertBefore(node, contentNode.endNode);
          this.childNodes.push(node);
        }

        // If no nodes were found, set the default content.
        if (foundNodes.length) {
          content.removeDefault(contentNode);
        } else {
          content.addDefault(contentNode);
        }
      }
    },

    function (data) {
      data.node.innerHTML = data.args[0];
    }
  )
};
