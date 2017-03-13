'use strict';

import Factory from "../factory";

/**
 * Domain object for chat windows
 */
class ChatWindowList {

    /**
     *
     * @type {{ChatWindow}}
     * @private
     */
    static _chatWindowList = {};

    /**
     * @type {ChatWindow}
     * @private
     */
    static _currentChatWindow = null;

    /**
     * @param user
     */
    static getChatWindow(user) {
        return this.chatWindowList[user.name];
    }

    /**
     * @param user
     * @returns ChatWindow
     */
    static getOrCreateChatWindow(user) {
        let chatWindow = this.getChatWindow(user);

        if (!chatWindow) {
            chatWindow = Factory.createChatWindow(user);
            this.addChatWindow(user, chatWindow);
        }

        return chatWindow;
    }

    /**
     * @param user
     * @param chatWindow
     */
    static addChatWindow(user, chatWindow) {
        this.chatWindowList[user.name] = chatWindow;
    }

    /**
     * @param user
     */
    static deleteChatWindow(user) {
        // delete this.chatWindowList[user.name];
    }

    /**
     * @returns {{ChatWindow}}
     */
    static get chatWindowList() {
        return this._chatWindowList;
    }

    /**
     * @returns {ChatWindow}
     */
    static get currentChatWindow() {
        return this._currentChatWindow;
    }

    /**
     * @type {ChatWindow}
     * @param value
     */
    static set currentChatWindow(value) {
        this._currentChatWindow = value;
    }
}

export default ChatWindowList;