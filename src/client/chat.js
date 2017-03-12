'use strict';

import Factory from "./factory";
import Peer from "peerjs";
import config from "./config";
import UserList from "./domain/userlist";
import ChatWindowList from "./domain/chatwindowlist";

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
        // this._channelManager = Factory.createChannelManager();
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
            config.gui.errorField.append(err + '<br>');
        });

        let chat = this;

        this.peer.listAllPeers(function (peerList) {
            peerList.forEach(function (username) {

                // just for safety reasons, server already manages not to listing of own user
                if (username !== config.peerjs.username) {

                    let user = UserList.getOrCreateUser(username);
                    UserList.addUserToGui(user, function() {
                        chat.userListItemClick(user, this)
                    })
                }
            })
        });
    }

    userListItemClick = function (user) {

        let chat = this;

        UserList.markUserActive(user);

        // remove unread messages hint

        // connect if not already connected

        if (!user.connected) {
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
        }

        // create chat window if necessary
        let chatWindow = ChatWindowList.getOrCreateChatWindow(user);

        // set headline
        config.gui.activeChatHeadline.html(user.name);

        // set chat messages
        config.gui.messagesList.html(chatWindow.messages);

        UserList.currentUser = user;
        ChatWindowList.currentChatWindow = chatWindow;
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
        let username = dataConnection.peer;

        let user = UserList.getOrCreateUser(username);
        let chatWindow = ChatWindowList.getOrCreateChatWindow(user);

        chatWindow.initChat(dataConnection);

        // todo check if needed any longer
        $('.filler').hide();

        dataConnection.on('close', function () {
            if ($('.connection').length === 0) {
                $('.filler').show();
            }

            let userListEntry = config.gui.userlist.find('#' + user.name);
            $(userListEntry).removeClass('connected').addClass('disconnected');

            user.connected = false;
            UserList.deleteUser(user);
            ChatWindowList.deleteChatWindow(user);
        });

        let userListEntry = UserList.getGuiUserListEntry(user);

        $(userListEntry).removeClass('disconnected').addClass('connected');

        user.connected = true;
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
     * Executes a given function for each active connection
     *
     * @param fn
     */
    eachActiveConnection(fn) {
        let actives = $('.connection.active');
        let checkedIds = {};

        let chat = this;

        actives.each(function () {
            // todo swap with reference to connection
            let username = $(this).attr('id');

            if (!checkedIds[username]) {
                let connections = chat._peer.connections[username];
                for (let i = 0, ii = connections.length; i < ii; i += 1) {
                    let connection = connections[i];

                    // todo workaround for closed peers which are still in the array
                    if (connection.open) {
                        fn(connection, $(this));
                    }
                }
            }

            checkedIds[username] = 1;
        });
    }
}

export default Chat;
