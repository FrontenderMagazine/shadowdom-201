<section>
**Heads up!** This article discusses APIs that are not yet fully standardized
and still in flux. Be cautious when using experimental APIs in your own projects.

This article discusses more of the amazing things you can do with Shadow DOM.
It builds on the concepts discussed in[Shadow DOM 101][1]. If you're looking
for an introduction, see that article.

## Introduction {#toc-intro}

Let's face it. There's nothing sexy about unstyled markup. Lucky for us, 
[the brilliant folks behind Web Components][2] foresaw this and didn't leave us
hanging. We have many options when it comes to styling content in a shadow tree.

## Style encapsulation {#toc-style-scoped}

One of the core features of Shadow DOM is the [shadow boundary][3]. It has a
lot of nice properties, but one of the best is that it provides style 
encapsulation for free. Stated another way:

By default, CSS styles defined inside Shadow DOM are scoped to its ShadowRoot
.

Below is an example. If all goes well and your browser supports Shadow DOM (it
doesn't!), you'll see "Shadow DOM Title".

    <div><h3>Host title</h3></div>
    <script>
    var root = document.querySelector('div').webkitCreateShadowRoot();
    root.innerHTML = '<style>h3{ color: red; }</style>' + 
                     '<h3>Shadow DOM Title</h3>';
    </script>
    

There are two interesting observations about this demo:

*   There are [other h3s on this page](), but the only one that matches the h3
    selector, and therefore styled red, is the one in the ShadowRoot. Again, scoped 
    styles by default.
   
*   Other styles rules defined on this page that target h3s don't bleed into my
    content. That's because
   **selectors don't cross the shadow boundary**.

Moral of the story? We have style encapsulation from the outside world. Thanks
Shadow DOM!

## Styling the host element {#toc-style-host}

The `@host` [at-rule][4] allows you to select and style the element hosting a
shadow tree:

    <button class="bigger">My Button</button>
    <script>
    var root = document.querySelector('button').webkitCreateShadowRoot();
    root.innerHTML = '<style>' + 
        '@host{' + 
          'button { text-transform: uppercase; }' +
          '.bigger { padding: 20px; }' +
        '}' +
        '</style>' + 
        '<content select=""></content>';
    </script>
    

One gotcha is that rules wrapped in a `@host` have higher specificity than any
selector in the parent page, but a lower specificity than a`style` attribute
defined on the host element.`@host` also only works in the context of a
ShadowRoot so you can't use it outside of Shadow DOM.

A common use case for `@host` is when you're creating a custom element and want
to react to different user states (:hover, :focus, :active, etc.
).

    <style>
    @host {
      * {
        opacity: 0.4;
        <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">transition:</span> opacity 420ms ease-in-out;</a>
      }
      *:hover {
        opacity: 1;
      }
      *:active {
        position: relative;
        top: 3px;
        left: 3px;
      }
    }
    </style>
    

In this example, I've used "*" to select any type of element that's hosting my
shadow tree. "I don't care what type of element you are. Just style yourself 
like this.
"

Another need for `@host` is if you want to potentially style multiple types of
hosts from within the same Shadow DOM, say if you're creating a custom element. 
Or perhaps you have different themes based on the host element.

    @host {
      g-foo { 
        /* Applies if the host is a <g-foo> element.*/
      }
    
      g-bar {
        /* Applies if the host is a <g-bar> element. */
      }
    
      div {
        /* Applies if the host element is a <div>. */
      }
    
      * {
        /* Applies to any type of element hosting this ShadowRoot. */
      }
    }
    

## Creating style hooks {#toc-style-hooks}

Customization is good. In certain cases, you may want to poke holes in your
Shadow's styling shield and create hooks for others to style.

### Using custom pseudo elements {#toc-custom-pseduo}

Both [WebKit][5] and [Firefox][6] define pseudo elements for styling internal
pieces of native browser elements. A good example is the`input[type=range]`.
You can style the slider thumbblue by targeting `::-webkit-slider-thumb`:

    input[type=range].custom::-webkit-slider-thumb {
      -webkit-appearance: none;
      background-color: blue;
      width: 10px;
      height: 40px;
    }
    

Similar to how WebKit/FF provides styling hooks into some internals, authors of
Shadow content can designate certain elements as styleable by outsiders. This is
done through custom pseudo elements.

You can designate an element as a custom pseudo element by using the `pseudo`
attribute. Its value, or name, needs to be prefixed with "x-". Doing so creates 
an association with that element in the shadow tree and gives outsiders a 
designated lane to cross the shadow boundary.

Here's an example of creating a custom slider widget and allowing someone to
style its slider thumbblue:

    <style>
      #host::x-slider-thumb {
        background-color: blue;
      }
    </style>
    <div id="host"></div>
    <script>
    var root document.querySelector('#host').webkitCreateShadowRoot();
    root.innerHTML = '<div>' +
                       '<div pseudo="x-slider-thumb"></div>' + 
                     '</div>';
    </script>
    

### Using CSS Variables {#toc-vars}

CSS Variables can be enabled in Chrome under "Enable experimental WebKit
features" in about:flags.

Another powerful way to create theming hooks will be through [CSS Variables][7]

A possible scenario might be a custom element author who marks out variable
placeholders in their Shadow DOM. One for styling an internal button's font and 
another for its color:

    button {
      color: <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var</span> (button-text-color, pink);</a> /* default color will be pink */
      font: <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var</span> (button-font) ;</a>
    }
    

Then, the embedder of the element defines those values to their liking. Perhaps
to match the awesome Comic Sans theme of their own page:

    #host {
      <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var-button-text-color:</span> green;</a>
      <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var-button-font:</span> "Comic Sans MS", "Comic Sans", cursive;</a>
    }
    

Due to the way CSS Variables inherit, everything is peachy and this works
beautifully! The whole picture looks like this:

    <style>
      #host {
        <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var-button-text-color:</span> green;</a>
        <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var-button-font:</span> "Comic Sans MS", "Comic Sans", cursive;</a>
      }
    </style>
    <div id="host">Host node</div>
    <script>
    var root document.querySelector('#host').webkitCreateShadowRoot();
    root.innerHTML = '<style>' + 
        'button {' + 
          'color: <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var</span> (button-text-color, pink);</a>' + 
          'font: <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin" id="tooltip159.08" target="_blank" class="noexternal tooltip">+<span class="property">var</span> (button-font) ;</a>' + 
        '}' +
        '</style>' +
        '<content></content>';
    </script>
    

## Inheriting and resetting styles {#toc-style-inheriting}

In some cases, you may want to let foreign styles into your shadow tree. A
prime example is a commenting widget. Most authors embedding that widget 
probably want the thing to look like it belongs on their page. I know I would. 
Thus, we need a way to adopt the look and feel of the embedding page; by 
inheriting fonts, colors, line-heights, etc.

For flexibility, Shadow DOM allows us to poke more holes in its style shield.
There are two properties to control the what bleeds in:

*   **.resetStyleInheritance**
*   **.applyAuthorStyles**
    *   `true` - styles defined in the author's document are applied. Think of
        this as allowing styles to "bleed" across the boundary.
       
    *   `false` - Default. Author styles are not applied to the shadow tree.

Below is a demo for seeing how a shadow tree is affected by changing these two
properties.

    <div><h3>Host title</h3></div>
    <script>
    var root = document.querySelector('div').webkitCreateShadowRoot();
    root.applyAuthorStyles = true;
    root.resetStyleInheritance = false;
    root.innerHTML = '<style>h3{ color: red; }</style>' + 
                     '<h3>Shadow DOM Title</h3>' + 
                     '<content select="h3"></content>';
    </script>
    

It's easy to see how `.applyAuthorStyles` works. It makes the Shadow DOM's h3
inherit the look of the other h3s on this page (e.g "applying the page author's 
styles
").

Even with the `apply-author-styles` attribute set, CSS selectors defined in the
document do not cross the shadow boundary.**Style rules only match when they're
entirely inside or outside of the shadow tree.**

![DevTools inherited properties][8]

Understanding `.resetStyleInheritance` is a bit trickier, primarily because it
only has an effect on CSS properties which are inheritable. It says: when you're
looking for a property to inherit, at the boundary between the page and the 
ShadowRoot, don't inherit values from the host but use the`initial` value
instead (per the CSS spec
).

If you're unsure about which properties inherit in CSS, check out 
[this handy list][9] or toggle the "Show inherited" checkbox in the Element
panel.

### Scenario cheatsheet {#style-inherit-cheetsheet}

To better understand when you might use these properties, below is a decision
matrix to help. Carry this around in your pocket. It's gold!

| Scenario
| applyAuthorStyles | resetStyleInheritance
|

| "I have my own appearance, but want to match basic properties like text color
."  
*basically, you're creating a widget*                                     |
false             | false
|
| "Forget the page! I have my own theme"  
*you'll still need a "component reset
stylesheet" because distributed content gets the styles it had in the page.* | 
false             | true
|
| "I'm a component designed to get my
theme from styles in the page
"                                                                                          | true              | true                  |
| "I want to blend in with the page
as much as possible.
"  
*remember selectors don't cross the
shadow boundary*.                                             | true
| false
|

## Styling distributed nodes {#toc-style-disbtributed-nodes}

`.applyAuthorStyles`/`.resetStyleInheritance` are strictly for effecting the
styling behavior of the nodes defined**in** the Shadow DOM. 

Distributed nodes are a different beast. They're not logically in the Shadow
DOM; they're still children of the host element which are swizzled into place at
"render time." Naturally, they get their styles from the document they're in (
the host's document). The only exception to that rule is that they may gain 
additional styles from the place they've been swizzled into (the Shadow DOM
).

### ::distributed() pseudo element {#toc-distributed}

If distributed nodes are children of the host element, how then do we target +
style them from*within* the Shadow DOM? The answer is the `::distributed()`
pseudo element. It's the first-ever*functional* pseudo element which takes a
CSS selector for its parameter.

Let's see a simple example:

    <div><h3>Host title</h3></div>
    <script>
    var root = document.querySelector('div').webkitCreateShadowRoot();
    root.innerHTML = '<style>' + 
                       'h3{ color: red; }' + 
                       'content::-webkit-distributed(h3) { color: green; }' + 
                     '</style>' + 
                     '<h3>Shadow DOM Title</h3>' +
                     '<content select="h3"></content>';
    </script>
    

You should see "Shadow DOM Title"" and "Host Title" below it. Also note that "
Host title" is still retaining the styles from its document. In this case, the 
page.

### Resetting styles at insertion points {#toc-shadow-resetstyles}

When creating a ShadowRoot, you have the option of resetting the inherited
styles.`<content>` and `<shadow>` insertion points also have this
option. When using these elements, either set the`.resetStyleInheritance` in JS
or use the boolean`reset-style-inheritance` attribute on the element itself.

*   For a ShadowRoot or `<shadow>` insertion points: 
    `reset-style-inheritance` means inheritable CSS properties are set to 
    `initial` at the host, before they hit your shadow content. **This location
    is known as the upper boundary
   **.

*   For `<content>` insertion points: `reset-style-inheritance` means
    inheritable CSS properties are set to
   `initial` before the host's children are distributed at the insertion point
    . **This location is known as the lower boundary**.

## Conclusion {#toc-conclusion}

As authors of custom elements, we have a ton of options for controlling the
look and feel of our content. Shadow DOM forms the basis for this brave new 
world.

Shadow DOM gives us scoped style encapsulation and a means to let in as much (
or as little) of the outside world as we choose. By defining custom pseudo 
elements or including CSS Variable placeholders, authors can provide third-
parties convenient styling hooks to further customize their content. All in all,
web authors are in full control of how their content is represented.

Thanks to [Dominic Cooney][10] and [Dimitri Glazkov][11] for reviewing the
content of this tutorial.</section>

 [1]: http://www.html5rocks.com/tutorials/webcomponents/shadowdom/

 [2]: https://dvcs.w3.org/hg/webcomponents/raw-file/tip/explainer/index.html#acknowledgements

 [3]: https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#shadow-trees

 [4]: https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#host-at-rule

 [5]: http://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css?format=txt

 [6]: https://developer.mozilla.org/en-US/docs/CSS/CSS_Reference/Mozilla_Extensions#Pseudo-elements_and_pseudo-classes
 [7]: http://dev.w3.org/csswg/css-variables/
 [8]: img/showinheritance.gif "DevTools inherited properties"
 [9]: http://www.impressivewebs.com/inherit-value-css/
 [10]: http://www.html5rocks.com/profiles/#dominiccooney
 [11]: https://plus.google.com/111648463906387632236/posts