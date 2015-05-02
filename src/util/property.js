'use strict';

export default function (child, name, descriptor) {
  descriptor.configurable = true;
  Object.defineProperty(child, name, descriptor);
}
