import content from '../util/content';
import query from '../util/query';
import fragment from '../util/fragment';

export default {
  get: function () {
    if (!this.__wrapped) {
      return this.__node.innerHTML;
    }

    var html = '';
    var childNodes = this.childNodes;
    var childNodesLen = childNodes.length;

    for (let a = 0; a < childNodesLen; a++) {
      let childNode = childNodes[a];
      html += childNode.outerHTML || childNode.textContent;
    }

    return html;
  },

  set: function (html) {
    if (!this.__wrapped) {
      this.__node.innerHTML = html;
      return;
    }

    var contentNodes = content.get(this);
    var contentNodesLen = contentNodes.length;
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
  }
};
