/**
 * Selectonic.js
 * Version: 0 (under development)
 * Selectonic - parse <select> tag to object, then convert it to html.
 * Author: Niklan
 * Site: http://niklan.net/
 * Licensed under GPL v2.
 *
 * @TODO: select option window styles: min width as select, auto with.
 * @TODO: Default label for select: label+selected value, selected value.
 * @TODO: Select position for options: auto, left, bottom-left, bottom,
 *        bottom-right, right, top-left, top, top-right.
 *
 * @TODO: generators: select, options list
 */
;
(function ($, window, document, undefined) {

  var pluginName = 'selectonic',
    defaults = {
      // Settings for main Selectonic, except type specific.
      // Select type
      type: 'classic',
      // Class name using for detecting HTML selects.
      className: 'selectonic'
    };

  // Selectonic constructor.
  function Selectonic(element, options) {
    // Cache constructor.
    var self = this;
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this.data = {};
    this._defaults = defaults;
    this._name = pluginName;

    // Initialization.
    this.init(this.element);

    // API
    return {
      parseSelect: function () {
        self.parseSelect(self.element);
      }
    }
  }

  /**
   * Plug-in functionality.
   */
  Selectonic.prototype = {
    /**
     * Initialization.
     */
    init: function (element) {
      // Parse our select element into Object.
      var selectObject = this.parseSelect(element);
      // Save select object for further using.
      this.options['selectObject'] = selectObject;

      // Get type function.
      this.getTypeFunction();
      // Generate select.
      this.create();
      // Render to page.
      this.render();
    },

    /**
     * Parse <select> element into Object.
     */
    parseSelect: function (element) {
      var select = $(element).get(0);
      var selectElement = {
        originalSelect: select,
        name: $(select).attr('name') ? $(select).attr('name') : false,
        size: $(select).attr('size') ? $(select).attr('size') : false,
        multiple: $(select).attr('multiple') ? true : false,
        hasGroups: $(select).has('optgroup').length ? true : false,
        groups: {},
        options: {}
      };

      if (selectElement.hasGroups) {
        selectElement['groups'] = $(element).find('optgroup').map(function () {
          return {
            label: $(this).attr('label'),
            options: $(this).find('option').map(function () {
              return {
                value: $(this).attr('value') ? $(this).attr('value') : $(this).html(),
                data: $(this).html(),
                selected: $(this).attr('selected') ? true : false,
                disabled: $(this).attr('disabled') ? true : false
              };
            })
          };
        }).get();
      }
      else {
        selectElement['options'] = $(element).find('option').map(function () {
          return {
            value: $(this).attr('value') ? $(this).attr('value') : $(this).html(),
            data: $(this).html(),
            selected: $(this).attr('selected') ? true : false,
            disabled: $(this).attr('disabled') ? true : false
          };
        })
      }

      return selectElement;
    },

    /**
     * Theme HTML with data.
     * @param tpl - HTML template with variables.
     * @param variables - array with values to template.
     *
     * T.e. theme('<span>{text}</span>', {text: 'Example'}); will produce:
     * <span>Example</span>.
     */
    theme: function (tpl, variables) {
      return tpl.replace(/\{([^\}]+)\}/g, function (variable, key) {
        return key in variables ? variables[key] : variable;
      });
    },

    /**
     * Getting function instance for style type.
     */
    getTypeFunction: function () {
      var self = this;
      var options = self.options;
      var typeFunction = options.type;

      switch (typeFunction) {
        case 'classic':
          typeFunction = 'SelectonicClassic';
          break;
      }

      var functionInstance = window[typeFunction];
      if (typeof functionInstance != 'function') {
        throw "Selectonic: Style function does not exist.";
      }

      var typeObject = new functionInstance();
      self.options.typeFunction = typeObject;
    },

    /**
     * Create our select.
     * This is preparation before render.
     * @param type
     */
    create: function () {
      var self = this;
      var options = self.options;
      var element = self.element;
      var data = {
        'options': options,
        'element': element,
        'selectonic': self
      };

      // Cache object.
      var typeObject = options.typeFunction;

      // Call init() function and saves returned data.
      var init = typeObject.init(data);
      data = $.extend({}, data, {'init': init});

      // Call generate() function. This function must return template.
      var generate = typeObject.generate(data);
      if (generate == undefined) {
        throw "Selectonic: generate() function for selected style does not return template.";
      }
      data = $.extend({}, data, {
        'generate': generate,
        'template': self.theme(generate[0], generate[1])
      });

      // Save.
      self.data = data;
    },

    /**
     * Render function renders our data to page.
     */
    render: function () {
      var self = this;
      var options = self.options;
      var element = self.element;
      var data = self.data;
      var type = options.type;
      var newSelect = $(data.template);
      this.data.newSelect = newSelect;

      $(element).hide();
      $(element).after(newSelect);

      self.onSelectCreate();

      // Bind events.
      $('.select', newSelect).bind('click', function () {
        self.onSelectClick();
      });
    },

    /**
     * onSelectCreate event.
     */
    onSelectCreate: function () {
      this.options.typeFunction.onSelectCreate(this.data);
    },

    /**
     * onSelectClick event handler.
     */
    onSelectClick: function () {
      this.options.typeFunction.onSelectClick(this.data);
    }
  };

  /**
   * Classic style for select.
   * @constructor
   */
  window.SelectonicClassic = function () {
  };

  SelectonicClassic.prototype = {
    init: function (data) {
    },

    generate: function (data) {
      var selectonic = data.selectonic;
      var options = data.options;
      var className = options.className;
      var items = options.selectObject.options;

      // Create label.
      var label = false;
      for (var i = 0; i < items.length; i++) {
        if (items[i].selected) {
          label = items[i].value;
          break;
        }
      }
      if (!label) {
        label = items[0].value;
      }

      // Generate select options.
      var selectOptions = '';
      for (var i = 0; i < items.length; i++) {
        var classes = 'option';
        items[i].disabled ? classes += ' disabled' : false;
        items[i].selected ? classes += ' selected' : false;

        selectOptions += selectonic.theme(
          '<li data-value="{value}" class="{classes}">{data}</li>',
          {
            'value': items[i].value,
            'data': items[i].data,
            'classes': classes
          }
        );
      }

      var select = "<div class=\"{wrapperClasses}\">\n    <button class=\"{selectClasses}\">{selectLabel}</button>\n    <ul class=\"{selectOptionsClasses}\">\n        {selectOptions}\n    </ul>\n</div>";
      return [
        select,
        {
          'wrapperClasses': className + ' style-classic',
          'selectClasses': 'select',
          'selectLabel': label,
          'selectOptionsClasses': 'options',
          'selectOptions': selectOptions
        }
      ]
    },

    onSelectCreate: function (data) {
      var select = data.newSelect;
      var height = $('.select', select).outerHeight();
      $('.options', select).css({'top': height});
    },

    onSelectClick: function (data) {
      var select = data.newSelect;
      $(select).toggleClass('open');
    }
  };

  // Plugin registration.
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'api_' + pluginName)) {
        $.data(this, 'api_' + pluginName,
          new Selectonic($(this), options));
      }
    });
  };

})(jQuery, window, document, undefined);