Skate HTML Templates
====================

Skate HTML templates is a simple templating engine based on how the Shadow DOM spec uses the `<content>` element and `select` attribute.

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

If you want the templating engine to dynamically project elements into `<content>` areas, you must first wrap the element:

```js
var $body = skateTemplateHtml.wrap(document.body);
```

Once wrapped, you work with the wrapper just like a normal element. For example, if you wanted to add a third paragraph, all you'd need to do is:

```js
var thirdParagraph = document.createElement('p');
thirdParagraph.textContent = 'Third paragraph.';
$body.appendChild(thirdParagraph);

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

Notice how the when you appended the content, it didn't actually put it as a first child to the `body`, it actually moved it into the correct content area in the correct spot.

You could have achieved the same thing doing:

```js
$body.innerHTML += '<p>Third paragraph.</p>';
```

Additionally, if all paragraphs were removed from the `<section>`:

```js
$body.removeChild($body.childNodes[2]);
$body.removeChild($body.childNodes[1]);
$body.removeChild($body.childNodes[0]);
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

The properties and methods that are wrapped to give you this behaviour are:

1. `childNodes`
2. `firstChild`
3. `innerHTML`
4. `lastChild`
5. `outerHTML`
6. `textContent`
7. `appendChild()`
8. `insertAdjacentHTML()`
9. `insertBefore()`
10. `removeChild()`
11. `replaceChild()`

The following properties and methods are not wrapped (but are planned to be):

1. `elements`
2. `getElementsByClassName()`
3. `getElementsByTagName()`
4. `getElementsByTagNameNS()`
5. `querySelector()`
6. `querySelectorAll()`

Additionally, descendants are not wrapped (but are planned to be). This means the following members on descendants behave as they normally would:

1. `nextSibling`
2. `parentElement`
3. `parentNode`
4. `previousSibling`

*The wrapped elements may look and act like normal elements (including instanceof checks), but due to browser API limitations, you cannot pass it off to other DOM methods as an element.*



License
-------

The MIT License (MIT)

Copyright (c) 2014

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
