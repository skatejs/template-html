'use strict';

import call from './call';

export default class {
  static get (element) {
    return element.__skatejs_template_html_content;
  }

  static set (element, content) {
    element.__skatejs_template_html_content = content;
    return this;
  }

  static addDefault (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      call(content.container, 'insertBefore')(nodes[a], content.endNode);
    }

    content.isDefault = true;
  }

  static removeDefault (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      var node = nodes[a];
      call(node.parentNode, 'removeChild')(node);
    }

    content.isDefault = false;
  }
}
