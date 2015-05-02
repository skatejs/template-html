'use strict';

export default {
  fromNodeList: function (nodeList) {
    var frag = document.createDocumentFragment();

    if (Array.isArray(nodeList)) {
      let nodeListLength = nodeList.length;
      for (let a = 0; a < nodeListLength; a++) {
        frag.appendChild(nodeList[a]);
      }
    } else {
      while (nodeList && nodeList.length) {
        frag.appendChild(nodeList[0]);
      }
    }

    return frag;
  },

  fromString: function (domString) {
    var specialMap = {
      caption: 'table',
      dd: 'dl',
      dt: 'dl',
      li: 'ul',
      tbody: 'table',
      td: 'tr',
      thead: 'table',
      tr: 'tbody'
    };

    var tag = domString.match(/\s*<([^\s>]+)/);
    var div = document.createElement(tag && specialMap[tag[1]] || 'div').__element;

    div.innerHTML = domString;

    return this.fromNodeList(div.childNodes);
  }
};
