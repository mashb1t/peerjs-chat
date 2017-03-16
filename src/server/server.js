'use strict';

import {PeerServer} from "peer";

class BroadcastServer {

    /**
     * @type {PeerServer}
     * @private
     */
    _peerServer = null;

    constructor(options, callback) {
        this._peerServer = new PeerServer(options, callback);
    }

    addBroadcast() {
        // todo add broadcast functionality here
        console.log('test');
    }
}

module.exports = {
    BroadcastServer: BroadcastServer,
};


//
//
//
// var PeerServer = require('peer').PeerServer;
// var server = new PeerServer({port: 9000, path: '/myapp'});
// var connected = [];
// server.on('connection', function (id) {
//     var idx = connected.indexOf(id); // only add id if it's not in the list yet
//     if (idx === -1) {connected.push(id);}
// });
// server.on('disconnect', function (id) {
//     var idx = connected.indexOf(id); // only attempt to remove id if it's in the list
//     if (idx !== -1) {connected.splice(idx, 1);}
// });
// someexpressapp.get('/connected-people', function (req, res) {
//     return res.json(connected);
// });