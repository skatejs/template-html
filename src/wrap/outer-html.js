'use strict';

export default {
  get: function () {
    var name = this.tagName.toLowerCase();
    var html = '<' + name;
    var attrs = this.attributes;

    if (attrs) {
      var attrsLength = attrs.length;

      for (var a = 0; a < attrsLength; a++) {
        var attr = attrs[a];
        html += ' ' + attr.nodeName + '="' + attr.nodeValue + '"';
      }
    }

    html += '>';
    html += this.innerHTML;
    html += '</' + name + '>';

    return html;
  }
};
