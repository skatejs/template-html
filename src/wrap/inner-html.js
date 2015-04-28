'use strict';

import call from '../util/call';
import content from '../util/content';
import find from '../util/find';
import fragment from '../util/fragment';

export default {
  get: function () {
    var html = '';
    var childNodes = this.childNodes;
    var childNodesLen = childNodes.length;

    for (var a = 0; a < childNodesLen; a++) {
      var childNode = childNodes[a];
      html += childNode.outerHTML || childNode.textContent;
    }

    return html;
  },
  set: function (html) {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
    var targetFragment = fragment.fromString(html);

    for (var a = 0; a < contentNodesLen; a++) {
      var contentNode = contentNodes[a];
      var childNodes = find.between(contentNode.startNode, contentNode.endNode);

      // Remove all nodes (including default content).
      for (var b = 0; b < childNodes.length; b++) {
        var childNode = childNodes[b];
        call(childNode.parentNode, 'removeChild')(childNode);
      }

      var foundNodes = find.selector(targetFragment, contentNode.selector);

      // Add any matched nodes from the given HTML.
      for (var c = 0; c < foundNodes.length; c++) {
        call(contentNode.container, 'insertBefore')(foundNodes[c], contentNode.endNode);
      }

      // If no nodes were found, set the default content.
      if (foundNodes.length) {
        content.removeDefault(contentNode);
      } else {
        content.addDefault(contentNode);
      }
    }
  }
};
