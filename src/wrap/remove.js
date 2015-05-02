'use strict';

export default function () {
  var parent = this.parentNode;
  return parent && parent.removeChild(this);
}
