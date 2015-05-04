export default {
  get: function () {
    var len = this.children.length;
    return this.children[len - 1];
  }
};
