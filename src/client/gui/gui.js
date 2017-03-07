'use strict';

/**
 * Class for all gui elements
 */
class Gui {

    static logField = $('.log');

    /**
     * Function for logging to logfield
     */
    static logFunction = function() {
        let copy = Array.prototype.slice.call(arguments).join(' ');
        Gui.logField.append(copy + '<br>');
    }

}

export default Gui;


