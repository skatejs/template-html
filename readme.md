Skate HTML Templates
====================

Skate HTML templates is designed to be a very light implementation of how Shadow DOM uses `<content>` nodes and `select` attributes to project Light DOM. Just because it has Skate in the name doesn't mean you have to use it with Skate. It can be used completely on its own, too.

It works by defining a template:

```js
var myTemplate = skateTemplateHtml('<article><h3><content select=".heading"></content></h3><section><content><p>There is no content to display.</p></content></section></article>');
```

The compiled template is just a function that you call on an element. If you called the template above on the body:

```js
myTemplate(document.body);
```

The result would be:

```html
<body>
  <article>
    <h3></h3>
    <section>There is no content to display.</section>
  </article>
</body>
```

If this already existed in the `body`:

```html
<body>
  <span class="heading">My Heading</span>
  <p>First paragraph.</p>
  <p>Second paragraph.</p>
</body>
```

Then it would have been transformed into:

```html
<body>
  <article>
    <h3><span class="heading">My Heading</span></h3>
    <section>
      <p>First paragraph.</p>
      <p>Second paragraph.</p>
    </section>
  </article>
</body>
```

Once you template an element, it's accessors and methods are overridden so that you're only working with the Light DOM.

```js
var thirdParagraph = document.createElement('p');
thirdParagraph.textContent = 'Third paragraph.';
body.appendChild(thirdParagraph);

```

Doing that would result in:

```html
<body>
  <article>
    <h3><span class="heading">My Heading</span></h3>
    <section>
      <p>First paragraph.</p>
      <p>Second paragraph.</p>
      <p>Third paragraph.</p>
    </section>
  </article>
</body>
```

Notice how the when you appended the content, it didn't actually append it to the `body`, it actually appended it to the content area that was selecting paragraphs.

You could have achieved the same thing doing:

```js
body.innerHTML += '<p>Third paragraph.</p>';
```

Additionally, if all paragraphs were removed from the `<section>`:

```js
body.removeChild(body.childNodes[2]);
body.removeChild(body.childNodes[1]);
body.removeChild(body.childNodes[0]);
```

Then the default content that we specified in the template definition would take their place:

```html
<body>
  <article>
    <h3>
      <span class="heading">My Heading</span>
    </h3>
    <section>
      <p>There is no content to display.</p>
    </section>
  </article>
</body>
```

If you decide you want to put some content back in, then it will remove the default content in favour of the content you specify.

To unwrap a node that has been wrapped (accessors / methods overridden) just call `unwrap()` on the node:

```js
skateTemplateHtml.unwrap(document.body);
```

You can also manually wrap an element instead of templating it:

```js
skateTemplateHtml.wrap(document.body);
```

The properties and methods that are overridden to give you this behaviour are:

1. `appendChild()`
2. `childNodes`
3. `children`
4. `firstChild`
5. `innerHTML`
6. `insertAdjacentHTML()`
7. `insertBefore()`
8. `lastChild`
9. `outerHTML`
10. `removeChild()`
11. `replaceChild()`
12. `textContent`

The following properties and methods are not overridden but will be:

1. `getElementsByClassName()`
2. `getElementsByTagName()`
3. `getElementsByTagNameNS()`
4. `nextSibling`
5. `parentElement`
6. `parentNode`
7. `previousSibling`
8. `querySelector()`
9. `querySelectorAll()`
10. `remove()`


License
-------

The MIT License (MIT)

Copyright (c) 2014 - 2015

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
