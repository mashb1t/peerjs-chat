'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _peer = require('peer');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BroadcastServer = function () {
    function BroadcastServer(options, callback) {
        _classCallCheck(this, BroadcastServer);

        this._peerServer = null;

        this._peerServer = new _peer.PeerServer(options, callback);
    }

    /**
     * @type {PeerServer}
     * @private
     */


    _createClass(BroadcastServer, [{
        key: 'addBroadcast',
        value: function addBroadcast() {
            // todo add broadcast functionality here
            console.log('test');
        }
    }]);

    return BroadcastServer;
}();

module.exports = {
    BroadcastServer: BroadcastServer
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