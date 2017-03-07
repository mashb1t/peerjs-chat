'use strict';

import Factory from "./factory";
import KeyGenerator from "./rsa/keygenerator";

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

    /**
     * Constructor
     */
    constructor() {
        this._peer = Factory.createPeerConnection();
        // this._channelManager = Factory.createChannelManager();
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
    }


}

export default Chat;


