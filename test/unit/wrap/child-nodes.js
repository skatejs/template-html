'use strict';

import template from '../../../src/index';

describe('child-nodes:', function () {
  it('should return all nodes if no content elements were defined', function () {
    var el = template('one<two></two>')(document.createElement('div'));
    expect(el.childNodes[0].textContent).to.equal('one');
    expect(el.childNodes[1].tagName).to.equal('TWO');
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
