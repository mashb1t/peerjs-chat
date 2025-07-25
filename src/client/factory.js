'use strict';

import User from "./domain/data/user";
import ChatWindow from "./gui/chatwindow"
import config from "./config";
import Peer from "peerjs";

/**
 * Factory class for multiple instances
 */
class Factory {

    /**
     * @returns {Peer}
     */
    static createPeerConnection() {
        return new Peer(config.peerjs.username, config.peerjs.options);
        // return new Peer(config.peerjs.options);
    }

    /**
     * Create a new user
     *
     * @param name
     * @returns {User}
     */
    static createUser(name) {
        return new User(name);
    }

    /**
     * @param user
     * @returns {ChatWindow}
     */
    static createChatWindow(user) {
        return new ChatWindow(user);
    }
}

export default Factory;