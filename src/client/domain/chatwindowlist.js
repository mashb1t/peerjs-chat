'use strict';

import Factory from "../factory";

/**
 * Domain object for chat windows
 */
class ChatWindowList {

    // static _currentChatWindow;

    /**
     *
     * @type {{ChatWindow}}
     * @private
     */
    static _chatWindowList = {};

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
        delete this.chatWindowList[user.name];
    }

    /**
     * @returns {{ChatWindow}}
     */
    static get chatWindowList() {
        return this._chatWindowList;
    }

    //
    // static get current() {
    //     return this._currentChatWindow;
    // }
    //
    // static set current(value) {
    //     this._currentChatWindow = value;
    // }
}

export default ChatWindowList;