'use strict';

import Utils from "../utils";

/**
 * Class for all gui elements
 */
class ChatWindow {

    // static _current;

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
        this._messages.append().addClass('messages');
    }

    /**
     * @param dataConnection
     */
    initChat(dataConnection) {
        this._dataConnection = dataConnection;
        let messages = this._messages;
        let user = this._user;

        $('#connections').append(this._messages);

        this._dataConnection.on('data', function (data) {

            let message = this.createMessage(data, 'foreign');

            // todo replace with message list item
            Utils.appendAndScrollDown(messages, message);
        });

        this._dataConnection.on('close', function () {
            //todo write to chat
            console.log(user.name + ' has left the chat.');
            // messages.remove();
        });
    }

    /**
     * @type {MediaConnection}
     * @param fileConnection
     */
    initFileChat(fileConnection) {
        this._fileConnection = fileConnection;
        let chatbox = this._messages;
        let user = this._user;

        this._fileConnection.on('data', function (data) {
            let type = data.type;
            let filename = data.filename;
            let file = data.file;

            let htmlString = Utils.createBlobHtmlView(file, type, filename);

            if (htmlString) {
                Utils.appendAndScrollDown(chatbox, '<div><span class="file">' + user.name + ' has sent you a file: ' + htmlString + '.</span></div>');
            }
        });
    }

    createMessage(message, origin) {

        return $('<li></li>').addClass('message arrow').addClass(origin).text(message);
    }

    get messages() {
        return this._messages;
    }

    //
    // static get current() {
    //     return this._current;
    // }
    //
    // static set current(value) {
    //     this._current = value;
    // }
}

export default ChatWindow;


