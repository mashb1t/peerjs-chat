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
     */
    constructor(name) {
        this._name = name;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    get pubkey() {
        return this._pubkey;
    }

    set pubkey(value) {
        this._pubkey = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

export default User;