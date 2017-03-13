'use strict';

import util from "peerjs/lib/util";
import config from "./config";
import ChatWindowList from "./domain/chatwindowlist";
import Push from "push.js";

class Utils {

    /**
     * Appends a string to an element and scrolls to the bottom
     *
     * @param divToAppendDataTo
     * @param content
     */
    static appendAndScrollDown(divToAppendDataTo, content) {
        Utils._addUnread(divToAppendDataTo, content);
        divToAppendDataTo.append(content);
        Utils.scrollDown(divToAppendDataTo);
        Utils.refreshLightBox();
    }

    static scrollDown(element, animate = true) {
        if (animate) {
            element.animate({scrollTop: element[0].scrollHeight}, 1000);
        } else {
            element[0].scrollTop = element[0].scrollHeight;
        }
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
        let htmlString = '';
        let firstPartOfType = type.substr(0, type.indexOf('/'));

        switch (firstPartOfType) {
            case 'image':
                htmlString = '<img src="' + url + '" rel="lightbox" alt="' + filename + '"><br>';
                break;
            case 'audio':
                htmlString = '<audio controls>' +
                    '<source src="' + url + '" type="' + type + '">' +
                    'Your browser does not support html5 audio elements.' +
                    '</audio><br>';
                break;
            case 'video':
                htmlString = '<video controls>' +
                    '<source src="' + url + '" type="' + type + '">' +
                    'Your browser does not support html5 video elements.' +
                    '</video><br>';
                break;
        }

        htmlString += '<a download="' + filename + '" href="' + url + '">' + filename + '</a>';


        return htmlString;
    }

    /**
     * Do nothing (used on file drop events)
     *
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

        if (!supportedFeatures.data) {
            chatDiv.append('<div class="error">Your browser does not support WebRTC Data Channels, sry!</div>');
            chatDiv.append(errorHtml);
            return false;
        }

        chatDiv.find('.content').show();
        return true;
    }

    /**
     * Enable chat fields
     * If param is given, check if chatWindow is currently active
     *
     * @param chatWindow
     */
    static enableChatFields(chatWindow = null) {
        if (chatWindow && ChatWindowList.currentChatWindow !== chatWindow) {
            return;
        }

        config.gui.messageField.prop('disabled', false);
        config.gui.sendMessageButton.prop('disabled', false);
        config.gui.sendFileButton.prop('disabled', false);

        // todo still disabled for now, enable after implementing video feature
        config.gui.videoChatButton.prop('disabled', true);
    }

    /**
     * Disable chat fields
     * If param is given, check if chatWindow is currently active
     *
     * @param chatWindow
     */
    static disableChatFields(chatWindow = null) {
        if (chatWindow && ChatWindowList.currentChatWindow !== chatWindow) {
            return;
        }

        config.gui.messageField.prop('disabled', true);
        config.gui.sendMessageButton.prop('disabled', true);
        config.gui.sendFileButton.prop('disabled', true);
        config.gui.videoChatButton.prop('disabled', true);
    }

    /**
     * Triggers refresh on lightboxes
     */
    static refreshLightBox() {
        try {
            config.gui.lightbox();
        } catch (e) {
            // todo handle error due to no images
        }
    }

    static pushNotification(user, data) {
        Push.create(user.name, {
            body: data,
            // icon: {
            //     x16: user.icon,
            //     x32: user.icon
            // },
            timeout: 5000
        });
    }

    static clearAndFocusMessageField(chatWindow = null) {
        if (!chatWindow
            || !ChatWindowList.currentChatWindow
            || ChatWindowList.currentChatWindow !== chatWindow
            || !chatWindow.user.connected
        ) {
            return;
        }

        config.gui.messageField.val('');
        config.gui.messageField.focus();
    }

    /**
     *
     * @returns {*|jQuery}
     * @private
     */
    static _createBasicChatItem() {
        return $('<li></li>').addClass('message-wrapper');
    }

    /**
     * Creates a message
     * @param message
     * @param origin
     * @returns {XMLList|*|jQuery}
     */
    static createMessage(message, origin) {
        let messageObject = Utils._createBasicChatItem();
        let content = $('<span></span>').addClass('message arrow').addClass(origin).html(message);
        messageObject.append(content);

        return messageObject;
    }

    /**
     * Add separator and mark messages as unread
     *
     * @param divToAppendDataTo
     * @param content
     * @private
     */
    static _addUnread(divToAppendDataTo, content) {
        if (!ChatWindowList.currentChatWindow
            || ChatWindowList.currentChatWindow.messages.length == 0
            || ChatWindowList.currentChatWindow.messages == divToAppendDataTo
        ) {
            return;
        }

        let unreadSeparator = divToAppendDataTo.find('.unread-separator');

        if (!unreadSeparator[0]) {
            unreadSeparator = Utils._createBasicChatItem();
            unreadSeparator.addClass('unread-separator');
            divToAppendDataTo.append(unreadSeparator);
        }

        content.addClass('unread');

    }

    /**
     * Remove unread separator and marking of messages as unread
     *
     * @param chatWindow
     */
    static removeUnread(chatWindow) {
        if (chatWindow && ChatWindowList.currentChatWindow !== chatWindow) {
            return;
        }

        let messages = ChatWindowList.currentChatWindow.messages;
        let unreadSeparator = messages.find('.unread-separator');
        let unreadMessages = messages.find('.unread');

        setTimeout(function () {
            unreadSeparator.fadeOut().queue(function () {
                unreadSeparator.remove()
            });
            unreadMessages.removeClass('unread');
        }, 3000);
    }
}

export default Utils;
