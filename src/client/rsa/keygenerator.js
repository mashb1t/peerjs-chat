'use strict';

import KeyPair from "./data/keypair";
import RSALibWrapper from "./wrapper/rsalibwrapper";

/**
 * Creates keys
 *
 * Can be used as object or singleton
 */
class KeyGenerator {

    /**
     * Generate KeyPair with given passphrase
     *
     * @param passphrase
     * @returns {KeyPair}
     */
     static generateKeyPair(passphrase = '') {

        // create both keys
        let privateKey = RSALibWrapper.createPrivateKey(passphrase);
        let publicKey = RSALibWrapper.createPublicKey(privateKey);

        return new KeyPair(privateKey, publicKey);
    }
}

export default KeyGenerator;