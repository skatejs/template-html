var elementProto = window.HTMLElement.prototype;
var matchesSelector = (
  elementProto.matches ||
  elementProto.msMatchesSelector ||
  elementProto.webkitMatchesSelector ||
  elementProto.mozMatchesSelector ||
  elementProto.oMatchesSelector
);

export default {
  value: function (selector) {
    return this.nodeType === 1 && matchesSelector.call(this.__node, selector);
  }
};
