/**
 * Selectonic - parse <select> tag to object, then convert it to html.
 */
;
(function ($, window, document, undefined) {

    var pluginName = 'selectonic',
        defaults = {

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
        var selectObject = this.parseSelect(element);
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
                            value: $(this).attr('value'),
                            data: $(this).html()
                        };
                    })
                };
            }).get();
        }
        else {
            selectElement['options'] = $(element).find('option').map(function () {
                return {
                    value: $(this).attr('value'),
                    data: $(this).html()
                };
            })
        }

    };

    // Plugin registration.
    $.fn[pluginName] = function (options) {

        return this.each(function () {
            if (!$.data(this, 'api_' + pluginName)) {
                var instance = $.data(this, 'api_' + pluginName,
                    new Selectonic($(this), options));
            }
        });

    }

})(jQuery, window, document, undefined);