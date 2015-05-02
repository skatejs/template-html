'use strict';

import property from './property';

export default function (child, name, value) {
  property(child, name, {
    get: function () {
      return value;
    }
  });
}
