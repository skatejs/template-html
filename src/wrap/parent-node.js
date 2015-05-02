'use strict';

export default {
  get: function () {
    return this.__element.parentNode.__wrapper;
  }
};
