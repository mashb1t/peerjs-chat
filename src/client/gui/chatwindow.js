'use strict';

import Utils from "../utils";

/**
 * Class for all gui elements
 */
class ChatWindow {

    /**
     * @type {User}
     * @private
     */
    _user = null;

    /**
     * @type {DataConnection}
     * @private
     */
    _dataConnection = null;

    /**
     * @type {MediaConnection}
     * @private
     */
    _fileConnection = null;

    /**
     * @type {Object}
     * @private
     */
    _messages = null;

    /**
     * @param user
     */
    constructor(user) {
        this._user = user;

        this._messages = $('<ul></ul>').addClass('messages');
    }

    /**
     * @param dataConnection
     */
    initChat(dataConnection) {
        this._dataConnection = dataConnection;
        let messages = this._messages;
        let user = this._user;
        let chatWindow = this;

        this._dataConnection.on('data', function (data) {
            let message = Utils.createTextMessage(data, 'foreign');
            Utils.appendAndScrollDown(messages, message);
            Utils.pushNotification(user, data);
        });

        this._dataConnection.on('close', function () {
            let data = user.name + ' has left the chat.';

            // escaping of message is not necessarily needed here
            let message = Utils.createTextMessage(data, 'foreign');
            Utils.appendAndScrollDown(messages, message);
        });

        let message = Utils.createTextMessage('Connected', 'foreign');
        Utils.appendAndScrollDown(chatWindow.messages, message);
    }

    /**
     * @type {MediaConnection}
     * @param fileConnection
     */
    initFileChat(fileConnection) {
        this._fileConnection = fileConnection;
        let messages = this._messages;
        let user = this._user;
        let chatWindow = this;

        this._fileConnection.on('data', function (data) {
            let type = data.type;
            let filename = data.filename;
            let file = data.file;

            let htmlString = Utils.createBlobHtmlView(file, type, filename);

            if (htmlString) {
                let message = Utils.createHtmlMessage(htmlString, 'foreign file');
                Utils.appendAndScrollDown(messages, message);
                Utils.pushNotification(user, 'File ' + data.filename);
            }
        });
    }

    /**
     * Sends a chat message
     *
     * @param message
     */
    sendMessage(message) {
        this._dataConnection.send(message);
    }

    /**
     * Sends a file message
     *
     * @param fileWithMetaData
     */
    sendFile(fileWithMetaData) {
        this._fileConnection.send(fileWithMetaData);
    }

    /**
     * @returns {Object}
     */
    get messages() {
        return this._messages;
    }

    /**
     * @returns {User}
     */
    get user() {
        return this._user;
    }
}

export default ChatWindow;


