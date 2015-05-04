'use strict';

import content from './content';
import wrapped from '../api/wrapped';

export default function (fnWrapped, fnUnwrapped) {
  return function (...args) {
    var node = this.__node;
    var opts = {
      args: args,
      content: content.get(node),
      node: node
    };
    return wrapped(this) ?
      fnWrapped.call(this, opts) :
      fnUnwrapped.call(this, opts);
  }
}
