'use strict';

var nodeTextContent = Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent');

export default {
  // Fixed for same reason as innerHTML.
  get: function () {
    var textContent = '';
    var childNodes = this.childNodes;
    var childNodesLength = this.childNodes.length;

    for (let a = 0; a < childNodesLength; a++) {
      let childNode = childNodes[a];
      let nodeType = childNode.nodeType;

      if (nodeType === 1 || nodeType === 3) {
        textContent += childNode.textContent;
      }
    }

    return textContent;
  },

  // Fixed for same reason as innerHTML.
  set: function (text) {
    if (nodeTextContent && nodeTextContent.set) {
      nodeTextContent.set.call(this, text);
      return;
    }

    this.appendChild(document.createTextNode(text));
  }
};
