'use strict';

import config from "../../config";
import cryptico from "cryptico";

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
        return cryptico.generateRSAKey(passphrase, config.encryption.bits)
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