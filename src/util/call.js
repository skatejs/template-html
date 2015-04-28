'use strict';

export default function (node, fn) {
  fn = node['__' + fn] || node[fn];
  return function (...args) {
    return fn.apply(node, args);
  };
}
