export default {
  value: function (selector) {
    return this.__node.querySelectorAll(selector);
  }
};
