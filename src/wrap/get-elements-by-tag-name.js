export default {
  value: function (tagName) {
    return this.__node.getElementsByTagName(tagName);
  }
};
