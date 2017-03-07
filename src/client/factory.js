'use strict';

import User from "./domain/data/user";
import ChannelManager from "./domain/channelmanager";
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
        return new Peer(config.peerjs.options);
    }

    /**
     * Create a new user
     *
     * @param name
     * @param image
     * @param pubkey
     * @returns {User}
     */
    static createUser(name, image, pubkey) {
        return new User(name, image, pubkey);
    }

    /**
     * @returns {ChannelManager}
     */
    static createChannelManager() {
        return new ChannelManager();
    }
}

export default Factory;