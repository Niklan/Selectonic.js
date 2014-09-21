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

            // Style output.
            style: 'classic',

            // Class name using for detecting HTML selects.
            className: 'selectonic',

            // Default label for select. Can be selected, label.
            // For label variant, label must be provided via data-label.
            label: 'selected',

            // Inherit classes from original select.
            // @TODO
            inheritClasses: false,

            // After Selectonic initialization.
            afterInit: function () {
            }
        };

    // Selectonic constructor.
    function Selectonic(element, options) {

        // Cache constructor.
        var self = this;

        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init(this.element);

        // Callback after Selectonic initialized.
        this.options.afterInit.call(this);

        // API
        return {
            parseSelect: function () {
                self.parseSelect(self.element);
            }

        }

    }

    // Selectonic initialization.
    Selectonic.prototype.init = function (element) {

        // Translate our select element into Object.
        var selectObject = this.parseSelect(element);

        // Generate HTML for select, based on style.
        var selectHTML = this.generateSelect(selectObject);

        // Save select object for further using.
        this.options['selectObject'] = selectObject;

        // Build our HTML select.
        this.build(selectHTML);

    };

    /**
     * Parse <select> element into Object.
     */
    Selectonic.prototype.parseSelect = function (element) {

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
                            data: $(this).html()
                        };
                    })
                };
            }).get();
        }
        else {
            selectElement['options'] = $(element).find('option').map(function () {
                return {
                    value: $(this).attr('value') ? $(this).attr('value') : $(this).html(),
                    data: $(this).html()
                };
            })
        }

        return selectElement;
    };

    /**
     * Generate HTML Select from the Object based on style.
     * @param selectObject - Object of select element, prepared by parseSelect().
     *
     * @TODO: support for custom styles.
     */
    Selectonic.prototype.generateSelect = function (selectObject) {

        var style = this.options.style;
        var className = this.options.className;
        var self = this;

        // Data for style.
        var data = {
            'selectObject': selectObject,
            'originalSelect': selectObject.originalSelect,
            'classes': {
                // Class selector for wrapper.
                'default': className,
                // Class for select div.
                'select': className + '-select',
                // Class for options wrapper.
                'options': className + '-options-wrapper',
                // Class for single option element.
                'option': className + '-options-option'
            }
        };

        // Cache data.
        this.options.htmlData = data;

        // Generating html.
        var styleFunction;

        // Wrapper start.
        var selectHTML = '<div class="' + data.classes.default + '">';

        // Classic style.
        if (style == 'classic') {

            selectHTML += this.styleClassic('selector', data);

            if (data.selectObject.hasGroups) {
                selectHTML += this.styleClassic('optionsGroups', data);
            }
            else if (data.selectObject.multiple) {
                selectHTML += this.styleClassic('optionMultiple', data);
            }
            else {
                selectHTML += this.styleClassic('options', data);
            }

        }
        // User style.
        else {

            // Selector HTML.
            selectHTML += style.call(this, 'selector', data);

            if (data.selectObject.hasGroups) {
                selectHTML += style.call(this, 'optionsGroups', data);
            }
            else if (data.selectObject.multiple) {
                selectHTML += style.call(this, 'optionMultiple', data);
            }
            else {
                selectHTML += style.call(this, 'options', data);
            }

        }


        // Wrapper end.
        selectHTML += '</div>';

        return selectHTML;

    };

    /**
     * Default style of select.
     * @param data - object of data.
     */
    Selectonic.prototype.styleClassic = function (element, data) {

        switch (element) {

            case 'selector':
                return this.styleClassicSelect(data);
                break;

            case 'options':
                return this.styleClassicOptions(data);
                break;

            case 'optionsGroups':
                return this.styleClassicOptionsGroup(data);
                break;

            case 'optionsMultiple':
                return this.styleClassicOptionsMultiple(data);
                break;

        }

    };

    /**
     * Style select element.
     * @param data
     */
    Selectonic.prototype.styleClassicSelect = function (data) {

        return '<div class="' + data.classes.select + '">' + 'Just for testing' + ' ▾' + '</div>';

    };

    /**
     * Style select options.
     * @param data
     */
    Selectonic.prototype.styleClassicOptions = function (data) {

        var result = '<div class="' + data.classes.options + '">';

        if (data.selectObject.hasGroups) {
            // @TODO: when select has groups.
        }
        else {

            data.selectObject.options.each(function () {

                result += '<div class="' + data.classes.option + '" data-value="' + this.value + '">';
                result += this.data;
                result += '</div>';

            });

        }

        result += '</div>';

        return result;

    };

    /**
     * Style select options with group.
     * @param data
     */
    Selectonic.prototype.styleClassicOptionsGroup = function (data) {

        var result;

        return result;

    };

    /**
     * Style select options with multiple select.
     * @param data
     */
    Selectonic.prototype.styleClassicOptionsMultiple = function (data) {

        var result;

        return result;

    };

    /**
     * Build our html select.
     * @param selectHTML
     */
    Selectonic.prototype.build = function (selectHTML) {

        var self = this;
        var element = this.element;
        var classes = this.options.htmlData.classes;
        var newSelect = $(selectHTML);

        $(element).hide();
        $(element).after(newSelect);

        // Bind click for our select.
        $('.' + classes.select, $(newSelect)).bind('click', function (e) {
            self.selectClick($(this), e);
        });

        // Bind click for option selection.
        $('.' + classes.option, $(newSelect)).bind('click', function (e) {
            self.selectOptionClick($(this), e);
        });

        // Hide select options by default.
        $('.' + classes.options, $('.' + classes.select).parent()).hide();

    };

    /**
     * Function for handling selectonic click.
     * @param event
     */
    Selectonic.prototype.selectClick = function (element, event) {

        // .selectonic-select (classSelect - element)
        var selectElement = $(element).get(0);
        this.options['actionElement'] = selectElement;

        if ($(selectElement).hasClass('opened')) {
            this.selectClose(selectElement);
        }
        else {
            this.selectOpen(selectElement);
        }

    };

    /**
     * Open options for select.
     * @param element
     */
    Selectonic.prototype.selectOpen = function (element) {

        var classes = this.options.htmlData.classes;

        $(element).toggleClass('opened');
        $('.' + classes.options, $(element).parent()).show();

        // Setting up position for options.
        var position = $(element).parent().position();
        var height = $(element).outerHeight(true);

        $('.' + classes.options, $(element).parent()).css({
            position: 'absolute',
            top: position.top + height,
            left: position.left
        });

    };

    /**
     * Close option select.
     * @param element
     */
    Selectonic.prototype.selectClose = function (element) {

        var className = this.options.className;
        var classes = this.options.htmlData.classes;

        $(element).toggleClass('opened');
        $('.' + classes.options, $(element).parent()).hide();

    };

    /**
     * React on select option in select.
     * @param element
     * @param event
     */
    Selectonic.prototype.selectOptionClick = function (element, event) {

        var selectedOption = $(element).get(0);
        var originalSelect = this.options.selectObject.originalSelect;
        var actionElement = this.options.actionElement;
        // Set value to original select.
        $(originalSelect).val($(selectedOption).data('value'));

        this.selectClose($(actionElement));

    };

    // Plugin registration.
    $.fn[pluginName] = function (options) {

        return this.each(function () {
            if (!$.data(this, 'api_' + pluginName)) {
                $.data(this, 'api_' + pluginName,
                    new Selectonic($(this), options));
            }
        });

    }

})(jQuery, window, document, undefined);