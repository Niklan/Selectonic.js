/**
 * Selectonic - parse <select> tag to object, then convert it to html.
 */
(function ($) {

    $.fn.selectonic = function (options) {
        // Selector of <select> element.
        var select = $(this.selector);

        // Object of <select> elements.
        var selectObjects = $.fn.selectonic.parseSelect(select);

        console.log(selectObjects);

    }

    /**
     * This function parse <select> tag to object.
     * @param <select> tag selector.
     */
    $.fn.selectonic.parseSelect = function (select) {
        var result = new Object();
        var selectNum = 0;

        // For each select element.
        select.each(function () {
            // Select instance attributes.
            var selectElement = {
                name: $(this).attr('name'),
                size: $(this).attr('size'),
                multiple: $(this).attr('multiple'),
                hasGroups: $(this).has('optgroup').length ? true : false,
                groups: {},
                options: {}
            }

            // Parse options and groups.
            $(this).each(function () {

                if (selectElement.hasGroups) {
                    selectElement['groups'] = $(this).find('optgroup').map(function () {
                        return {
                            label: $(this).attr('label'),
                            options: $(this).find('option').map(function () {
                                return {
                                    value: $(this).attr('value')
                                };
                            })
                        };
                    }).get();
                }
                else {
                    selectElement['options'] = $(this).find('option').map(function () {
                        return {
                            value: $(this).attr('value')
                        };
                    })
                }

            });

            result[selectNum] = selectElement;
            selectNum++;
        });

        return result;
    }

})(jQuery);