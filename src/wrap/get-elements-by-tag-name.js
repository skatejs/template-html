'use strict';

export default {
  value: function (tagName) {
    return this.__element.getElementsByTagName(tagName);
  }
};
