'use strict';

class Utils {

    static logField = $('.log');

    /**
     * Function for logging to logfield
     */
    static logFunction = function () {
        let copy = Array.prototype.slice.call(arguments).join(' ');
        Utils.logField.append(copy + '<br>');
    };

    /**
     * Appends a string to an element and scrolls to the bottom
     *
     * @param activeChat
     * @param content
     */
    static appendAndScrollDown(activeChat, content) {
        activeChat.append(content);
        activeChat.animate({scrollTop: activeChat[0].scrollHeight}, 1000);
    }

    static beginsWith(needle, haystack) {
        return (haystack.substr(0, needle.length) == needle);
    }

    /**
     * Creates a blub, hopefully compatible with all relevant browsers
     *
     * @param data
     * @param type
     * @returns {Blob}
     */
    static createBlob(data, type) {
        try {
            return new Blob([data], {type: type});
        } catch (e) {
            try {
                let BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
                if (e.name == 'TypeError' && window.BlobBuilder) {
                    let bb = new BlobBuilder();
                    bb.append([data]);
                    return bb.getBlob(type);
                } else if (e.name == 'InvalidStateError') {
                    return new Blob([data], {type: type});
                }
            } catch (e) {
            }
        }
        return null;
    }

    /**
     * Creates an html element with data as source
     *
     * @param file
     * @param type
     * @param filename
     * @returns {String}
     */
    static createBlobHtmlView(file, type, filename) {
        let url = null;
        let htmlString = null;

        if (file.constructor === ArrayBuffer) {
            let dataView = new Uint8Array(file);
            let blob = Utils.createBlob(dataView, type);
            url = window.URL.createObjectURL(blob);

        } else if (file.constructor === File) {
            url = window.URL.createObjectURL(file);
        }

        if (url) {
            htmlString = Utils._getHtmlStringByType(url, type, filename);
        }


        return htmlString;
    }

    /**
     * Create html element depending on type
     *
     * @param url
     * @param type
     * @param filename
     * @returns {String}
     * @private
     */
    static _getHtmlStringByType(url, type, filename) {
        let htmlString = null;
        let firstPartOfType = type.substr(0, type.indexOf('/'));

        switch (firstPartOfType) {
            case 'image':
                htmlString = '<img src="' + url + '" alt="' + filename + '">';
                break;
            case 'audio':
                htmlString = '<audio controls>' +
                    '<source src="' + url + '" type="' + type + '">' +
                    'Your browser does not support html5 audio elements.' +
                    '</audio>';
                break;
            case 'video':
                htmlString = '<video controls>' +
                    '<source src="' + url + '" type="' + type + '">' +
                    'Your browser does not support html5 video elements.' +
                    '</video>';
                break;
            default:
                htmlString = '<a download="' + filename + '" href="' + url + '">' + filename + '</a>';
        }

        return htmlString;
    }
}

export default Utils;
