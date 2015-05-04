export default {
  get: function (otherNode) {
    return this.__node.compareDocumentPosition(otherNode);
  }
};
