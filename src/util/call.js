'use strict';

export default function (node, fn) {
  fn = node && node['__' + fn] || node[fn];
  return function (...args) {
    return fn && fn.apply(node, args);
  };
}
