'use strict';

export default function (node) {
  return !!node.__node.___wrapped;
}
