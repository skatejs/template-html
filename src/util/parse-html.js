'use strict';

var parser = new window.DOMParser();

export default function (html) {
  return parser.parseFromString(html, 'text/html').body.childNodes;
}
