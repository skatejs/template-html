import template from '../../src/index';

describe('content:', function () {
  var el;

  function wrap () {
    return template.wrap(el);
  }

  function unwrap () {
    return template.unwrap(el);
  }

  beforeEach(function () {
    el = document.createElement('div');
  });

  it('default values', function () {
    template(`<content>default</content>`)(el);
    expect(unwrap().textContent).to.equal('default');
  });

  it('default values (with select)', function () {
    template(`<content select="something">default</content>`)(el);
    expect(unwrap().textContent).to.equal('default');
  });

  it('default values (with other content)', function () {
    el.innerHTML = '<one>def</one><two>ect</two>';
    template(`<content select="one"></content><content select="three">ault</content>`)(el);
    expect(unwrap().textContent).to.equal('default');
  });

  it('user values - text', function () {
    el.textContent = 'custom';
    template(`<content>default</content>`)(el);
    expect(unwrap().textContent).to.equal('custom');
  });

  it('user values - html', function () {
    el.innerHTML = '<span>custom</span>';
    template(`<content>default</content>`)(el);
    expect(unwrap().textContent).to.equal('custom');
  });

  it('user values - html (with select)', function () {
    el.innerHTML = '<span>custom</span>';
    template(`<content select="span">default</content>`)(el);
    expect(unwrap().textContent).to.equal('custom');
  });
});
