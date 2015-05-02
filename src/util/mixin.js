'use strict';

import property from './property';

export default function (proto, parent) {
  Object.keys(parent).forEach(function (key) {
    property(proto, key, parent[key]);
  });
  return proto;
}
