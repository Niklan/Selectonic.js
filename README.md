Selectonic
==========

jQuery parser for &lt;select&rt; element, for further convertation into HTML-Select alternative.

Basic call:
```javascript
$('select').selectonic();
```

API
==========

Default settings.
```javascript
$('select').selectonic({
    type: 'classic'
})
```

| Option        | Default           | Type        |  Description |
| ------------- |:-----------------:|:-----------:|:-------------|
| type          | 'classic'         | function    | Function using for styling select. Presets: classic. |
| className     | 'selectonic'      | string      | Class for custom selects. This is not class for determinate select for replace.|


Declare own type (style)
==========

You must write you own js which contain object

```javascript
window.StyleName = function () {};
SelectonicClassic.prototype = {
    init: function (data) {},
    generate: function (data) {},
    onSelectCreate: function() {}
    onSelectClick: function() {}
  };
```