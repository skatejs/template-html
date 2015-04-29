'use strict';

export default {
  get: function () {
    var name = this.tagName.toLowerCase();
    var html = '<' + name;
    var attrs = this.attributes;

    if (attrs) {
      let attrsLength = attrs.length;

      for (let a = 0; a < attrsLength; a++) {
        let attr = attrs[a];
        html += ' ' + attr.nodeName + '="' + attr.nodeValue + '"';
      }
    }

    html += '>';
    html += this.innerHTML;
    html += '</' + name + '>';

    return html;
  }
};
