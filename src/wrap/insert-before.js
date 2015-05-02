'use strict';

import content from '../util/content';
import decide from '../util/decide';
import query from '../util/query';

export default {
  value: decide(
    function (data) {
      var contentNodes = data.content;
      var contentNodesLen = contentNodes.length;
      var node = data.args[0].__element;
      var referenceNode = data.args[1].__element;

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

          for (let a = 0; a < fragChildNodesLength; a++) {
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
      for (let b = 0; b < contentNodesLen; b++) {
        var contentNode = contentNodes[b];
        var betweenNodes = query.between(contentNode.startNode, contentNode.endNode);
        var betweenNodesLen = betweenNodes.length;

        for (let c = 0; c < betweenNodesLen; c++) {
          let betweenNode = betweenNodes[c];

          if (betweenNode === referenceNode) {
            hasFoundReferenceNode = true;
          }

          if (hasFoundReferenceNode) {
            let selector = contentNode.selector;
            if (!selector || node.__wrapper.matches(selector)) {
              betweenNode.parentNode.insertBefore(node, betweenNode);
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
    },

    function (data) {
      return data.node.insertBefore(data.args[0], data.args[1]);
    }
  )
};
