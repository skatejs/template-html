export default {
  value: function (className) {
    return this.__node.getElementsByClassName(className);
  }
};
