/**
 * Selectonic - parse <select> tag to object, then convert it to html.
 *
 * @TODO: select option window styles: min width as select, auto with.
 * @TODO: Default label for select: label+selected value, selected value.
 * @TODO: Select position for options: auto, left, bottom-left, bottom,
 *        bottom-right, right, top-left, top, top-right.
 */
;
(function ($, window, document, undefined) {

    var pluginName = 'selectonic',
        defaults = {

            // Style output.
            style: 'classic',

            // Class name using for detecting HTML selects.
            className: 'selectonic',

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
        var selectHTML = this.generateSelectHTML(selectObject);

        // Build our HTML select.
        this.build(selectHTML);

    };

    /**
     * Parse <select> element into Object.
     */
    Selectonic.prototype.parseSelect = function (element) {

        var select = $(element).get(0);
        var selectElement = {
            name: $(select).attr('name'),
            size: $(select).attr('size'),
            multiple: $(select).attr('multiple'),
            hasGroups: $(select).has('optgroup').length ? true : false,
            groups: {},
            options: {}
        }

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
    Selectonic.prototype.generateSelectHTML = function (selectObject) {

        var styleFunction = this.options.style;

        if (styleFunction == 'classic') {
            return this.styleClassic(selectObject);
        }

    }

    /**
     * Default style of select.
     * @param selectObject
     */
    Selectonic.prototype.styleClassic = function (selectObject) {

        var resultHTML = '';

        var className = this.options.className;

        resultHTML += '<div class="' + className + '">';
        resultHTML += '<div class="' + className + '-select">' + 'Select a value  ▾' + '</div>';
        resultHTML += '<div class="' + className + '-options-wrapper">';


        if (selectObject.hasGroups) {
            // @TODO: when select has groups.
        }
        else {

            selectObject.options.each(function () {

                resultHTML += '<div class="' + className + '-options-option" data-value="' + this.value + '">';
                resultHTML += this.data;
                resultHTML += '</div>';

            });

        }

        // .selectonic-options-wrapper
        resultHTML += '</div>';

        resultHTML += '</div>';

        return resultHTML;

    }

    /**
     * Build our html select.
     * @param selectHTML
     */
    Selectonic.prototype.build = function (selectHTML) {

        var element = this.element;
        var className = this.options.className;
        var self = this;

        $(element).hide();
        $(element).after(selectHTML);

        // Bind click for our select.
        $('.'+className+'-select').bind('click', function (e) {
            self.selectClick($(this), e);
        })

        // Hide select options by default.
        $('.'+className+'-options-wrapper', $('.'+className+'-select').parent()).hide();

    }

    /**
     * Function for handling selectonic click.
     * @param event
     */
    Selectonic.prototype.selectClick = function (element, event) {

        var className = this.options.className;

        // .selectonic-select
        var selectElement = $(element).get(0);

        // @TODO: Open\close select div.
        if ($(selectElement).hasClass('opened')) {

            $(selectElement).toggleClass('opened');
            $('.'+className+'-options-wrapper', $(selectElement).parent()).hide();

        }
        else {

            $(selectElement).toggleClass('opened');
            $('.'+className+'-options-wrapper', $(selectElement).parent()).show();

            // Setting up position for options.
            var position = $(selectElement).parent().position();
            var height = $(selectElement).outerHeight(true);

            $('.'+className+'-options-wrapper', $(selectElement).parent()).css({
                position: 'absolute',
                top: position.top + height,
                left: position.left
            });
        }

    }

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