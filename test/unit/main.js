define(['../../src/main.js'], function (template) {
  'use strict';

  var el;
  var $el;

  function tmp (str) {
    template(str)(el);
    return el;
  }

  beforeEach(function () {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  describe('Templates', function () {
    it('should retain template element order', function () {
      tmp('<one></one><two></two><three></three>')
        .innerHTML.should.equal('<one></one><two></two><three></three>');
    });

    it('should allow a function that is assumed that it will do the templating', function () {
      tmp('my template')
        .innerHTML.should.equal('my template');
    });

    it('should select all content from the inital html', function () {
      el.innerHTML = '<span>1</span><span>2</span>';
      tmp('<span><content></content></span>');
      expect(el.children[0].children[0].textContent).to.equal('1');
      expect(el.children[0].children[1].textContent).to.equal('2');
    });

    it('should select specific content from the inital html', function () {
      el.innerHTML = '<span>one</span><span>two</span>';
      tmp('<span><content select="span"></content></span>');
      expect(el.children[0].children[0].textContent).to.equal('one');
      expect(el.children[0].children[1].textContent).to.equal('two');
    });

    it('should only allow first children of the main element to be selected by the content element', function () {
      el.innerHTML = '<some><descendant></descendant></some>';
      tmp('<span><content select="some descendant"></content></span>');
      expect(el.children[0].children.length).to.equal(0);
    });

    it('should ignore non-element nodes', function () {
      el.innerHTML = '<span>one</span>\n<span>two</span>non-element-node';
      tmp('<span><content select="span"></content></span>');
      expect(el.innerHTML).to.not.contain('non-element-node');
    });

    describe('default content', function () {
      beforeEach(function () {
        el.innerHTML = 'initial content';
        tmp('<span><content>default content</content></span>');
        $el = template.wrap(el);
      });

      it('should initialise with custom content', function () {
        expect(el.textContent).to.equal('initial content');
      });

      it('should insert the default content if no content is found', function () {
        $el.innerHTML = '';

        // Because default content is not exposed.
        expect($el.innerHTML).to.equal('');

        // However, we must ensure that it does properly restore the default
        // content.
        expect(el.childNodes[0].textContent).to.equal('default content');
      });

      it('should remove the default content if content is inserted', function () {
        var span = document.createElement('span');

        // Clear to restore the default content.
        $el.innerHTML = '';

        // Now when we append a child, it should remove the default content.
        $el.appendChild(span);
        expect($el.childNodes[0]).to.equal(span);
      });
    });

    describe('wrapper methods', function () {
      function expectTemplate(one, two, any) {
        expect(el.innerHTML.replace(/<!--[\s\S]*?-->/g, '')).to.equal(
          '<span>' + (one || '') + '</span>' +
          '<span>' + (two || '') + '</span>' +
          '<span>' + (any || '') + '</span>' +
          '<span>dummy</span>'
        );
      }

      beforeEach(function () {
        el.innerHTML = '<one></one><two></two>';
        tmp('' +
          '<span><content select="one"></content></span>' +
          '<span><content select="two, three"></content></span>' +
          '<span><content></content></span>' +
          '<span>dummy</span>'
        );
        $el = template.wrap(el);
      });

      it('should allow calling of inherited methods and properties', function () {
        $el.setAttribute('testing', 'testing');
        expect($el.attributes.testing.value).to.equal('testing');
      });

      it('should return the first child', function () {
        expect($el.firstChild.tagName).to.equal('ONE');
      });

      it('should return the last child', function () {
        expect($el.lastChild.tagName).to.equal('TWO');
      });

      it('should return the nodes as a flat list to represent the light DOM', function () {
        expect($el.childNodes.length).to.equal(2);
        expect($el.childNodes[0].tagName).to.equal('ONE');
        expect($el.childNodes[1].tagName).to.equal('TWO');
      });

      it('should insert the element at the correct index in the light DOM: 0', function () {
        $el.insertBefore(document.createElement('three'), $el.childNodes[0]);
        expectTemplate('<one></one>', '<three></three><two></two>');
      });

      it('should insert the element at the correct index in the light DOM: 1', function () {
        $el.insertBefore(document.createElement('three'), $el.childNodes[1]);
        expectTemplate('<one></one>', '<three></three><two></two>');
      });

      it('should insert the element at the correct index in the light DOM: 2', function () {
        $el.insertBefore(document.createElement('three'), $el.childNodes[2]);
        expectTemplate('<one></one>', '<two></two><three></three>');
      });

      it('should throw an error if inserting before a node that does not exist', function () {
        expect(function () {
          $el.insertBefore(document.createElement('three'), document.createElement('notindom'));
        }).to.throw('DOMException 8: The node before which the new node is to be inserted is not a child of this node.');
      });

      it('should allow getting html', function () {
        expect($el.innerHTML).to.equal('<one></one><two></two>');
      });

      it('should allow setting html', function () {
        $el.innerHTML = '<one></one><two></two>';
        expectTemplate('<one></one>', '<two></two>');
      });

      it('should allow getting textContent', function () {
        $el.childNodes[0].textContent = 'testing';
        $el.childNodes[1].textContent = 'testing';
        expectTemplate('<one>testing</one>', '<two>testing</two>');
      });

      it('should allow setting textContent', function () {
        $el.textContent = 'testing';
        expectTemplate('', '', 'testing');
      });

      describe('insertAdjacentHTML', function () {
        beforeEach(function () {
          el.innerHTML = '<one></one><two></two>';

          tmp('' +
            '<span><content></span>' +
            '<span><content select="two, three"></span>' +
            '<span><content select=""></span>' +
            '<span>dummy</span>'
          );

          $el = template.wrap(el);
        });

        it('beforebegin', function () {
          $el.insertAdjacentHTML('beforebegin', '<three></three>');
          expect(el.previousSibling.tagName).to.equal('THREE');
        });

        it('afterbegin', function () {
          $el.insertAdjacentHTML('afterbegin', '<three></three>');
          expect($el.firstChild.tagName).to.equal('THREE');
        });

        it('beforeend', function () {
          $el.insertAdjacentHTML('beforeend', '<three></three>');
          expect($el.childNodes[2].tagName).to.equal('THREE');
        });

        it('afterend', function () {
          $el.insertAdjacentHTML('afterend', '<three></three>');
          expect(el.nextSibling.tagName).to.equal('THREE');
        });
      });

      describe('removeChild', function () {
        it('should remove the specified child', function () {
          $el.removeChild($el.firstChild);
          $el.removeChild($el.lastChild);
          expectTemplate('', '');
        });
      });

      describe('replaceChild', function () {
        it('should remplace the specified child', function () {
          $el.replaceChild(document.createElement('three'), $el.lastChild);
          expectTemplate('<one></one>', '<three></three>');
        });
      });
    });

    it('should keep references to the original light DOM', function () {
      var div = document.createElement('div');
      var input = document.createElement('input');
      var temp = skateTemplateHtml('<content></content>');

      div.appendChild(input);
      temp(div);

      div.children[0].should.equal(input);
    });
  });

  describe('Parsing HTML input for placeholders', function () {
    it('should detect where to project content to from HTML input', function () {
      var div = document.createElement('div');
      div.innerHTML = '<!-- content { "selector": "h1" } --><!-- /content -->' +
        '<div>' +
          '<!-- content --><!-- /content -->'
        '</div>';

      skateTemplateHtml.wrap(div).innerHTML = '<h1>Heading</h1><span>1</span><a>2</a>';
      expect(div.innerHTML).to.equal('<!-- content { "selector": "h1" } --><h1>Heading</h1><!-- /content --><div><!-- content --><span>1</span><a>2</a><!-- /content --></div>');
    });
  });
});
