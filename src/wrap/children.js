export default {
  get: function () {
    return this.childNodes.filter(function (node) {
      return node.nodeType === 1;
    });
  }
};
