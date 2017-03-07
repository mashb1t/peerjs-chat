'use strict';

/**
 * Domain object for chat user
 */
class User {

    _name = null;
    _image = null;
    _pubkey = null;

    /**
     * Constructor
     *
     * @param name
     * @param image
     * @param pubkey
     */
    constructor(name, image, pubkey) {
        this._name = name;
        this._image = image;
        this._pubkey = pubkey;
    }

    /**
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {*}
     */
    get image() {
        return this._image;
    }

    /**
     * @returns {*}
     */
    get pubkey() {
        return this._pubkey;
    }
}

export default User;