'use strict';

export default {
  get: function () {
    var childNodes = this.childNodes;
    return childNodes.length && childNodes[0] || null;
  }
};
