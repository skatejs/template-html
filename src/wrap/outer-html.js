import htmlOf from '../util/html-of';

export default {
  get: function () {
    return htmlOf(this);
  },

  set: function (outerHTML) {
    this.__node.outerHTML = outerHTML;
  }
};
