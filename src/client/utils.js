'use strict';

import util from "peerjs/lib/util";

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
        Utils.scrollDown(activeChat);
    }

    static scrollDown(element) {
        element.animate({scrollTop: element[0].scrollHeight}, 1000);
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
                htmlString += '<a download="' + filename + '" href="' + url + '">' + filename + '</a>';
                break;
            case 'audio':
                htmlString = '<audio controls>' +
                    '<source src="' + url + '" type="' + type + '">' +
                    'Your browser does not support html5 audio elements.' +
                    '</audio>';
                htmlString += '<a download="' + filename + '" href="' + url + '">' + filename + '</a>';
                break;
            case 'video':
                htmlString = '<video controls>' +
                    '<source src="' + url + '" type="' + type + '">' +
                    'Your browser does not support html5 video elements.' +
                    '</video>';
                htmlString += '<a download="' + filename + '" href="' + url + '">' + filename + '</a>';
                break;
            default:
                htmlString = '<a download="' + filename + '" href="' + url + '">' + filename + '</a>';
        }

        return htmlString;
    }

    /**
     * @param e
     */
    static doNothing(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Did nothing');
    }

    static checkCompatibility() {
        let supportedFeatures = util.supports;
        let chatDiv = $('#chat');
        let errorHtml = $('<div class="errors"></div>');

        for (let property in supportedFeatures) {
            if (supportedFeatures.hasOwnProperty(property)) {
                errorHtml.append('<div class="error">' + property + ': ' + supportedFeatures[property] + '</div>');
            }
        }


        if(!supportedFeatures.data) {
            chatDiv.append('<div class="error">Your browser does not support WebRTC Data Channels, sry!</div>');
            chatDiv.append(errorHtml);
            return false;
        }

        chatDiv.find('.content').show();
        return true;
    }
}

export default Utils;
