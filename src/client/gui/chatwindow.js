'use strict';

/**
 * Class for all gui elements
 */
class ChatWindow {

    static _current;

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
    _chatbox = null;

    // todo maybe remove, not used yet
    _messages = null;

    /**
     * @param user
     */
    constructor(user) {
        this._user = user;

        this._chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', this._user.name);
        let header = $('<h3></h3>').html('<strong>' + this._user.name + '</strong>');
        this._messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
        this._chatbox.append(header);
        this._chatbox.append(this._messages);

        this._chatbox.on('click', function () {
            if ($(this).attr('class').indexOf('active') === -1) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    /**
     * @param dataConnection
     */
    initChat(dataConnection) {
        this._dataConnection = dataConnection;
        let chatbox = this._chatbox;
        let user = this._user;

        $('#connections').append(this._chatbox);

        this._dataConnection.on('data', function (data) {
            chatbox.append('<div><span class="peer">' + user.name + '</span>: ' + data + '</div>');
            chatbox.animate({scrollTop: chatbox[0].scrollHeight}, 1000);
        });

        this._dataConnection.on('close', function () {
            console.log(user.name + ' has left the chat.');
            chatbox.remove();
        });
    }

    /**
     * @type {MediaConnection}
     * @param fileConnection
     */
    initFileChat(fileConnection) {
        this._fileConnection = fileConnection;
        let chatbox = this._chatbox;
        let user = this._user;

        this._fileConnection.on('data', function (data) {
            // If we're getting a file, create a URL for it.
            if (data.constructor === ArrayBuffer) {
                let dataView = new Uint8Array(data);
                let dataBlob = new Blob([dataView]);
                let url = window.URL.createObjectURL(dataBlob);
                chatbox.append('<div><span class="file">' + user.name + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
            }
        });
    }

    static get current() {
        return this._current;
    }

    static set current(value) {
        this._current = value;
    }
}

export default ChatWindow;


