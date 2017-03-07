'use strict';

/**
 * Data object for rivate and public key
 */
class KeyPair {

    _privateKey = null;
    _publicKey = null;

    /**
     * Constructor
     *
     * @param privateKey
     * @param publicKey
     */
    constructor(privateKey, publicKey) {
        this._privateKey = privateKey;
        this._publicKey = publicKey;
    }

    /**
     * @returns {RSAKey}
     */
    get privateKey() {
        return this._privateKey;
    }

    /**
     * @returns {String}
     */
    get publicKey() {
        return this._publicKey;
    }
}

export default KeyPair;