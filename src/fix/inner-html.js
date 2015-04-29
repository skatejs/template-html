'use strict';

import fragment from '../util/fragment';
import htmlOf from '../util/html-of';

var elementInnerHTML = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML');

export default {
  // Chrome doesn't report innerHTML properly using the original getter once
  // it's been overridden. This ensures that it uses the proper means to do so.
  // This may be because of some internal cache or something but it just doesn't
  // work.
  get: function () {
    var html = '';
    var childNodes = this.childNodes;
    var childNodesLen = childNodes.length;

    for (var a = 0; a < childNodesLen; a++) {
      let childNode = childNodes[a];
      html += htmlOf(childNode);
    }

    return html;
  },

  // Webkit doesn't return anything when Object.getOwnPropertyDescriptor() is
  // called to get built-in accessors so we've got to fully re-implement
  // innerHTML if we can't get an accessor for it.
  set: function (html) {
    if (elementInnerHTML && elementInnerHTML.set) {
      elementInnerHTML.set.call(this, html);
      return;
    }

    var frag = fragment.fromString(html);
    this.appendChild(frag);
  }
};
