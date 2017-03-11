import Utils from "./utils";

let config = {
    "peerjs": {
        "options": {
            "host": "localhost",
            "port": 9000,
            "path": "/",
            "debug": 3,
            "logFunction": Utils.logFunction
        }
    },
    "encryption": {
        "bits": 1024
    }
};

export default config;