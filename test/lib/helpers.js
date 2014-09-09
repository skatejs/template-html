define(function () {
  'use strict';

  var FIXTURE_ID = 'fixture';
  var FIXTURE_ELEMENT = 'div';

  return {
    fixture: function (html) {
      var fixture = document.getElementById(FIXTURE_ID);

      if (!fixture) {
        fixture = document.createElement(FIXTURE_ELEMENT);
        fixture.id = FIXTURE_ID;
        document.body.appendChild(fixture);
      }

      if (arguments.length) {
        fixture.innerHTML = '';

        if (typeof html === 'string') {
          fixture.innerHTML = html;
        } else if (typeof html === 'object') {
          fixture.appendChild(html);
        }
      }

      return fixture;
    },

    dispatch: function (name, element) {
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(name, true, true, {});
      element.dispatchEvent(e);
    }
  };
});
