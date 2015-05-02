'use strict';

import content from '../util/content';

export default function (node) {
  node.__skateTemplateHtmlWrapped = true;

  if (!content.get(node)) {
    content.set(node, content.parse(node));
  }

  return node;
}
