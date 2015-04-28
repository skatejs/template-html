'use strict';

import call from '../util/call';
import content from '../util/content';
import find from '../util/find';

export default {
  value: function (node, referenceNode) {
    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;

    // If no reference node is supplied, we append. This also means that we
    // don't need to add / remove any default content because either there
    // aren't any nodes or appendChild will handle it.
    if (!referenceNode) {
      return this.appendChild(node);
    }

    // Handle document fragments.
    if (node instanceof window.DocumentFragment) {
      var fragChildNodes = node.childNodes;

      if (fragChildNodes) {
        var fragChildNodesLength = fragChildNodes.length;

        for (var a = 0; a < fragChildNodesLength; a++) {
          this.insertBefore(fragChildNodes[a], referenceNode);
        }
      }

      return this;
    }

    var hasFoundReferenceNode = false;

    // There's no reason to handle default content add / remove because:
    // 1. If no reference node is supplied, appendChild handles it.
    // 2. If a reference node is supplied, there already is content.
    // 3. If a reference node is invalid, an exception is thrown, but also
    //    it's state would not change even if it wasn't.
    mainLoop:
    for (var b = 0; b < contentNodesLen; b++) {
      var contentNode = contentNodes[b];
      var betweenNodes = find.between(contentNode.startNode, contentNode.endNode);
      var betweenNodesLen = betweenNodes.length;

      for (var c = 0; c < betweenNodesLen; c++) {
        var betweenNode = betweenNodes[c];

        if (betweenNode === referenceNode) {
          hasFoundReferenceNode = true;
        }

        if (hasFoundReferenceNode) {
          var selector = contentNode.selector;

          if (!selector || find.matches(node, selector)) {
            call(betweenNode.parentNode, 'insertBefore')(node, betweenNode);
            break mainLoop;
          }
        }
      }
    }

    // If no reference node was found as a child node of the element we must
    // throw an error. This works for both no child nodes, or if the
    // reference wasn't found to be a child node.
    if (!hasFoundReferenceNode) {
      throw new Error('DOMException 8: The node before which the new node is to be inserted is not a child of this node.');
    }

    return node;
  }
};
