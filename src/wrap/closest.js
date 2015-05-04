export default {
  value: function (selector) {
    return this.__node.closest(selector);
  }
};
