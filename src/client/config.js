import Gui from "./gui/gui";

let config = {
    "peerjs": {
        "options": {
            "host": "localhost",
            "port": 9000,
            "path": "/",
            "debug": 3,
            "logFunction": Gui.logFunction
        }
    },
    "encryption": {
        "bits": 1024
    }
};

export default config;