'use strict';

import Factory from "./factory";
import Peer from "peerjs";
import config from "./config";

/**
 * Chat main class
 */
class Chat {

    /**
     * @type {Peer}
     * @private
     */
    _peer = null;

    _userList = {};

    _chatWindowList = {};

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

    // /**
    //  * @returns {{}}
    //  */
    // get userList() {
    //     return this._userList;
    // }

    /**
     * @param username
     */
    getUserFromList(username) {
        return this._userList[username];
    }

    /**
     * @param user
     */
    addUserToList(user) {
        this._userList[user.name] = user;
    }

    /**
     * @param user
     */
    deleteUserFromList(user) {
        delete this._userList[user.name];
    }

    /**
     * @param user
     */
    getChatWindowFromList(user) {
        return this._chatWindowList[user.name];
    }

    /**
     * @param user
     * @param chatWindow
     */
    addChatWindowToList(user, chatWindow) {
        this._chatWindowList[user.name] = chatWindow;
    }

    /**
     * @param user
     */
    deleteChatWindowFromList(user) {
        delete this._chatWindowList[user.name];
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
        this._peer.on('connection', this.connect);

        this._peer.on('error', function (err) {
            config.gui.errorField.append(err + '<br>');
        });


        let chat = this;

        this.peer.listAllPeers(function (peerList) {
            peerList.forEach(function (username) {

                // just for safety reasons, server already manages not to listing of own user
                if (username !== config.peerjs.username) {

                    let user = chat.getOrCreateUser(username);

                    let userListEntry = $('<li class="user disconnected" id="' + user.name + '">' +
                        '<img class="gravatar" src="' + user.image + '">' +
                        '<span class="name">' + user.name + '</span>' +
                        '</li>');

                    userListEntry.on('click', function () {

                        // inactivate all users in userlist
                        config.gui.userlist.find('.user').each(function (index, element) {
                            $(element).removeClass('active');
                        });

                        // activate this selected user list entry
                        userListEntry.addClass('active');

                        // remove unread messages hint

                        // connect if not already connected

                        if (!user.connected) {
                            // connect
                            // Create 2 connections, one labelled chat and another labelled file.
                            let dataConnection = chat.peer.connect(username, {
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


                            let fileConnection = chat.peer.connect(username, {
                                label: 'file', reliable: true
                            });

                            fileConnection.on('open', function () {
                                chat.connect(fileConnection);
                            });

                            fileConnection.on('error', function (err) {
                                alert(err);
                            });

                            chat.addUserToList(user);
                        }

                        // create chat window if necessary
                        let chatwindow = chat.getOrCreateChatWindow(user);

                        // set headline
                        config.gui.activeChatHeadline.html(user.name);

                        // set chat messages
                        config.gui.messagesList.html(chatwindow.messages);
                    });

                    config.gui.userlist.append(userListEntry);
                }
            })
        });
    }

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

        // fix for peer call of this in closure connect
        let chat = this;
        if (this instanceof Peer) {
            chat = this.chat;
        }

        let user = chat.getOrCreateUser(username);
        let chatWindow = chat.getOrCreateChatWindow(user);

        chatWindow.initChat(dataConnection);

        $('.filler').hide();

        dataConnection.on('close', function () {
            if ($('.connection').length === 0) {
                $('.filler').show();
            }

            let userListEntry = config.gui.userlist.find('#' + user.name);
            $(userListEntry).removeClass('connected').addClass('disconnected');

            user.connected = false;
            chat.deleteUserFromList(user);
            chat.deleteChatWindowFromList(user);
        });

        let userListEntry = config.gui.userlist.find('#' + user.name);
        $(userListEntry).removeClass('disconnected').addClass('connected');

        user.connected = true;
    }

    /**
     * @param fileConnection
     */
    initFileConnection(fileConnection) {
        let username = fileConnection.peer;

        // fix for peer call of this in closure connect
        let chat = this;
        if (this instanceof Peer) {
            chat = this.chat;
        }

        let user = chat.getOrCreateUser(username);
        let chatWindow = chat.getOrCreateChatWindow(user);

        chatWindow.initFileChat(fileConnection);
    }

    /**
     * @param username
     * @returns {User}
     */
    getOrCreateUser(username) {
        let user = this.getUserFromList(username);

        if (!user) {
            user = Factory.createUser(username);
            this.addUserToList(user)
        }

        return user;
    }

    /**
     * @param user
     * @returns {User}
     */
    getOrCreateChatWindow(user) {
        let chatWindow = this.getChatWindowFromList(user);

        if (!chatWindow) {
            chatWindow = Factory.createChatWindow(user);
            this.addChatWindowToList(user, chatWindow);
        }

        return chatWindow;
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
