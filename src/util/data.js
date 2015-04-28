'use strict';

export function getData (element, name) {
  if (element.__SKATE_TEMPLATE_HTML_DATA) {
    return element.__SKATE_TEMPLATE_HTML_DATA[name];
  }
}

export function setData (element, name, value) {
  if (!element.__SKATE_TEMPLATE_HTML_DATA) {
    element.__SKATE_TEMPLATE_HTML_DATA = {};
  }

  element.__SKATE_TEMPLATE_HTML_DATA[name] = value;

  return element;
}
