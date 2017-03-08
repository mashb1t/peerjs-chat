'use strict';

import Factory from "./factory";
import KeyGenerator from "./rsa/keygenerator";
import Peer from "peerjs";

/**
 * Chat main class
 */
class Chat {

    _userList = {};

    /**
     * @type {Peer}
     * @private
     */
    _peer = null;

    _connectedPeers = {};

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

    get connectedPeers() {
        return this._connectedPeers;
    }

    addConnectedPeer(peerId) {
        this._connectedPeers[peerId] = 1;
    }

    deleteConnectedPeer(peerId) {
        delete this._connectedPeers[peerId];
    }


    /**
     * Registers user and public key
     *
     * @param name
     * @param image
     * @param pubkey
     */
    registerNewUser(name, image, pubkey) {
        this._userList[name] = Factory.createUser(name, image, pubkey);
    }

    /**
     * Post public key to server and other clients
     *
     * @param publicKey
     */
    postPublicKey(publicKey) {

    }

    /**
     * Start the chat client
     */
    start() {
        let keyPair = KeyGenerator.generateKeyPair();
        let publicKey = keyPair.publicKey;

        this.postPublicKey(publicKey);

        // Show this peer's ID.
        this._peer.on('open', function (id) {
            $('#pid').text(id);
        });

        // Await connections from others
        this._peer.on('connection', this.connect);

        this._peer.on('error', function (err) {
            console.log(err);
        })
    }

    connect = function (c) {

        // fix for peer call of this in closure connect
        let chat = this;
        if (this instanceof Peer) {
            chat = this.chat;
        }

        // Handle a chat connection.
        if (c.label === 'chat') {
            let chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
            let header = $('<h3></h3>').html('<strong>' + c.peer + '</strong>');
            let messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
            chatbox.append(header);
            chatbox.append(messages);

            // Select connection handler.
            chatbox.on('click', function () {
                if ($(this).attr('class').indexOf('active') === -1) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
            $('.filler').hide();
            $('#connections').append(chatbox);

            c.on('data', function (data) {
                messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data +
                    '</div>');
            });
            c.on('close', function () {
                alert(c.peer + ' has left the chat.');
                chatbox.remove();
                if ($('.connection').length === 0) {
                    $('.filler').show();
                }
                // todo somehow replace with class reference.
                chat.deleteConnectedPeer(c.peer);
            });
        } else if (c.label === 'file') {
            c.on('data', function (data) {
                // If we're getting a file, create a URL for it.
                if (data.constructor === ArrayBuffer) {
                    let dataView = new Uint8Array(data);
                    let dataBlob = new Blob([dataView]);
                    let url = window.URL.createObjectURL(dataBlob);
                    $('#' + c.peer).find('.messages').append('<div><span class="file">' +
                        c.peer + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
                }
            });
        }
        // todo somehow replace with class reference
        chat.addConnectedPeer(c.peer);
    };

    eachActiveConnection(fn) {
        let actives = $('.connection.active');
        let checkedIds = {};

        let chat = this;

        actives.each(function () {
            let peerId = $(this).attr('id');

            if (!checkedIds[peerId]) {
                let conns = chat._peer.connections[peerId];
                for (let i = 0, ii = conns.length; i < ii; i += 1) {
                    let conn = conns[i];
                    fn(conn, $(this));
                }
            }

            checkedIds[peerId] = 1;
        });
    }
}

export default Chat;

// Make sure things clean up properly.

