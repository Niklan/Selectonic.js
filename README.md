Selectonic
==========

jQuery parser for &lt;select> element, for further convertation into HTML-Select alternative.

```javascript
$('select').selectonic();
```

Options
==========

```javascript
$('select').selectonic({
    afterInit: alert('Hello World after init!')
})
```

| Option        | Default           | Type      |  Description |
| ------------- |:-----------------:|:---------:|:-------------|
| afterInit     | `function(){}`    | function  | Callback function after plugin initialized.             |
| style         | classic           | function  | Name of function which gives selectObject for further generating HTML from that. |


API
==========
Selectonic provides API as well.

For using API create Selectonic instance.

For single `<select>` element.

```javascript
var selectonic = $('select').selectonic().data('api_selectonic');
```

If you have multiple `<select>` elements use this code.

```javascript
$('select').each(function() {
    var selectonic = $('select').selectonic().data('api_selectonic');
});
```
Then you can use API methods.

F.e.

```javascript
var selectonic = $('select').selectonic().data('api_selectonic');
selectonic.parseSelect($('select'));
```