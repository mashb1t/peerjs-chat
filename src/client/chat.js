'use strict';

import Factory from "./factory";
import Peer from "peerjs";
import config from "./config";
import UserList from "./domain/userlist";
import ChatWindowList from "./domain/chatwindowlist";
import Utils from "./utils";

/**
 * Chat main class
 */
class Chat {

    /**
     * @type {Peer}
     * @private
     */
    _peer = null;

    /**
     * Constructor
     */
    constructor() {
        this._peer = Factory.createPeerConnection();

        // fix for peer call of function connect when connecting
        this._peer.chat = this;
    }

    /**
     * @returns {Peer}
     */
    get peer() {
        return this._peer;
    }

    //
    // /**
    //  * Post public key to server and other clients
    //  *
    //  * @param publicKey
    //  */
    // postPublicKey(publicKey) {
    //
    // }

    /**
     * Start the chat client
     */
    start() {
        // let keyPair = KeyGenerator.generateKeyPair();
        // let publicKey = keyPair.publicKey;
        //
        // this.postPublicKey(publicKey);

        // Await connections from others
        this._peer.on('connection', this.connect, this);

        this._peer.on('error', function (err) {
            let chatWindow = ChatWindowList.currentChatWindow;

            if (!chatWindow) {
                chatWindow = ChatWindowList.getOrCreateChatWindow(Factory.createUser('ERROR'));
                ChatWindowList.currentChatWindow = chatWindow;
                config.gui.messageList.html(chatWindow.messages);
            }

            let message = Utils.createMessage(err.type + ' - ' + err, 'foreign');

            Utils.appendAndScrollDown(chatWindow.messages, message);
            Utils.disableChatFields();
        });

        let chat = this;

        this.peer.listAllPeers(function (peerList) {
            peerList.forEach(function (username) {

                // just for safety reasons, server already manages not to listing of own user
                if (username !== config.peerjs.username) {

                    let user = UserList.getOrCreateUser(username);
                    UserList.addUserToGui(user, function () {
                        chat.userListItemClick(user);
                    });
                }
            });
        });

        Utils.disableChatFields();
    }

    userListItemClick = function (user) {

        let chat = this;

        UserList.currentUser = user;
        UserList.markUserActive(user);

        // create chat window if necessary
        let chatWindow = ChatWindowList.getOrCreateChatWindow(user);
        ChatWindowList.currentChatWindow = chatWindow;

        // remove unread messages hint

        // connect if not already connected

        if (!user.connected) {
            Utils.disableChatFields(chatWindow);

            // connect
            // Create 2 connections, one labelled chat and another labelled file.
            let dataConnection = chat.peer.connect(user.name, {
                label: 'chat',
                serialization: 'none',
                metadata: {message: 'hi i want to chat with you!'}
            });
            dataConnection.on('open', function () {
                chat.connect(dataConnection);
            });
            dataConnection.on('error', function (err) {
                alert(err);
            });


            let fileConnection = chat.peer.connect(user.name, {
                label: 'file', reliable: true
            });

            fileConnection.on('open', function () {
                chat.connect(fileConnection);
            });

            fileConnection.on('error', function (err) {
                alert(err);
            });
        } else {
            Utils.enableChatFields();
        }

        // todo move to utils class
        // set headline
        config.gui.activeChatHeadline.html(user.name);

        // set chat messages
        config.gui.messageList.html(chatWindow.messages);

        Utils.scrollDown(chatWindow.messages, false)
        Utils.removeUnread(chatWindow);
    };

    connect = function (connection) {

        // fix for peer call of this in closure connect
        let chat = this;
        if (this instanceof Peer) {
            chat = this.chat;
        }

        switch (connection.label) {
            case 'chat':
                chat.initChatConnection(connection);
                break;
            case 'file':
                chat.initFileConnection(connection);
                break;
        }
    };

    /**
     * @param dataConnection
     */
    initChatConnection(dataConnection) {
        let chat = this;

        let username = dataConnection.peer;
        let user = UserList.getOrCreateUser(username);

        UserList.addUserToGui(user, function () {
            chat.userListItemClick(user, this)
        });

        let chatWindow = ChatWindowList.getOrCreateChatWindow(user);

        chatWindow.initChat(dataConnection);

        // // todo check if needed any longer
        // $('.filler').hide();

        dataConnection.on('close', function () {
            // if ($('.connection').length === 0) {
            //     $('.filler').show();
            // }

            UserList.markUserDisonnected(user);

            user.connected = false;
            UserList.deleteUser(user);
            ChatWindowList.deleteChatWindow(user);

            Utils.disableChatFields(chatWindow);
        });

        user.connected = true;
        UserList.markUserConnected(user);
        Utils.enableChatFields(chatWindow);
    }

    /**
     * @param fileConnection
     */
    initFileConnection(fileConnection) {
        let username = fileConnection.peer;

        let user = UserList.getOrCreateUser(username);
        let chatWindow = ChatWindowList.getOrCreateChatWindow(user);

        chatWindow.initFileChat(fileConnection);
    }

    /**
     * Handle message sending
     */
    handleSendMessage() {
        let message = config.gui.messageField.val();
        let chatWindow = ChatWindowList.currentChatWindow;

        if (message && chatWindow && chatWindow.user.connected) {
            chatWindow.sendMessage(message);

            let messageObject = Utils.createMessage(message, 'mine');
            Utils.appendAndScrollDown(chatWindow.messages, messageObject);

            Utils.clearAndFocusMessageField(chatWindow);
        }
    }

    handleSendFile(e) {
        let file = e.target.files[0];
        let chatWindow = ChatWindowList.currentChatWindow;

        if (file && chatWindow && chatWindow.user.connected) {

            let fileWithMetaData = {
                filename: file.name,
                type: file.type,
                file: file
            };

            chatWindow.sendFile(fileWithMetaData);

            let htmlString = Utils.createBlobHtmlView(file, file.type, file.name);

            if (htmlString) {
                let messageObject = Utils.createMessage(htmlString, 'mine');
                Utils.appendAndScrollDown(chatWindow.messages, messageObject);
            }
        }
    }
}

export default Chat;
