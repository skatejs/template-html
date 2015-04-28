'use strict';

import fragment from '../util/fragment';

export default {
  value: function (where, html) {
    if (where === 'afterbegin') {
      this.insertBefore(fragment.fromString(html), this.childNodes[0]);
    } else if (where === 'beforeend') {
      this.appendChild(fragment.fromString(html));
    } else {
      this.__insertAdjacentHTML(where, html);
    }

    return this;
  }
};
