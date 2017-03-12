'use strict';

import config from "../../config";
import crypto from "crypto";

/**
 * Wrapper for rsa library
 */
class RSALibWrapper {
    //
    // /**
    //  * Current rsa library reference
    //  */
    // static _rsaLib = Cryptico;

    /**
     * Create a new private key
     *
     * @param passphrase
     */
    static createPrivateKey(passphrase) {
        return crypto.publicDecrypt
    }

    /**
     * Create a public key by private key
     *
     * @param privateKey
     * @returns {*}
     */
    static createPublicKey(privateKey) {
        return cryptico.publicKeyString(privateKey);
    }
}

export default RSALibWrapper;