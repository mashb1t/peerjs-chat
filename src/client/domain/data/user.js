'use strict';

/**
 * Domain object for chat user
 */
class User {

    _name = null;
    _image = null;
    _pubkey = null;
    _connected = null;

    /**
     * Constructor
     *
     * @param name
     */
    constructor(name) {
        this._name = name;
        this.image = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y';
        this._connected = false;
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

    get connected() {
        return this._connected;
    }

    set connected(value) {
        this._connected = value;
    }
}

export default User;