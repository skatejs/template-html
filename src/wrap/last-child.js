export default {
  get: function () {
    var childNodes = this.childNodes;
    return childNodes[childNodes.length - 1];
  }
};
