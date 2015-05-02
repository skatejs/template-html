'use strict';

import template from '../../../src/index';

describe('child-nodes:', function () {
  // This differs from what happens natively. In native land, if you've defined
  // a shadow root without content nodes, no content will ever be projected but
  // your elements still appear as light DOM on the element.
  // This functionality should change so that we keep track of "hidden" nodes
  // (nodes that are not projected). This is useful for web components that
  // may use hidden nodes as a form of data.
  it('should return no nodes if no content elements were defined', function () {
    var el = template('one<two></two>')(document.createElement('div'));
    expect(el.childNodes.length).to.equal(0);
  });

  it('should only return nodes within content elements if they were defined', function () {
    var el = template('outside<outside></outside><content select="one"></content><content select="two"></content>')(document.createElement('div'));
    el.innerHTML = '<one></one><two></two>';
    expect(el.childNodes.length).to.equal(2);
    expect(el.childNodes[0].tagName).to.equal('ONE');
    expect(el.childNodes[1].tagName).to.equal('TWO');
  });

  it('should not return default content nodes', function () {
    var el = template('<content>default</content>')(document.createElement('div'));
    expect(el.childNodes.length).to.equal(0);
  });
});
