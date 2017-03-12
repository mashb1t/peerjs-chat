'use strict';

import Chat from "./chat";
import Utils from "./utils";
import config from "./config";

$(function () {

    if (Utils.checkCompatibility()) {

        let chat = new Chat();
        chat.start();

        // // Prepare file drop box.
        // let box = $('#box');
        // box.on('dragenter', Utils.doNothing);
        // box.on('dragover', Utils.doNothing);
        // box.on('drop', function (e) {
        //     e.originalEvent.preventDefault();
        //     let file = e.originalEvent.dataTransfer.files[0];
        //
        //     chat.eachActiveConnection(function (connection, activeChat) {
        //         if (connection.label === 'file') {
        //             let fileWithMetaData = {
        //                 filename: file.name,
        //                 type: file.type,
        //                 file: file
        //             };
        //             connection.send(fileWithMetaData);
        //
        //             let htmlString = Utils.createBlobHtmlView(file, file.type, file.name);
        //
        //             if (htmlString) {
        //                 Utils.appendAndScrollDown(activeChat, '<div><span class="file">You sent a file:' + htmlString + '</span></div>');
        //             }
        //         }
        //     });
        // });
        //
        // /**
        //  * Connect to a peer
        //  */
        // $('#connect').click(function () {
        //     let username = $('#rid').val();
        //
        //     if (!username) {
        //         alert('Please enter a username to connect to');
        //     } else if (username == config.peerjs.username) {
        //         alert('You can\'t connect to yourself!');
        //     } else if (chat.getUserFromList(username)) {
        //         alert('You are already connected to ' + username);
        //     } else {
        //         let user = chat.getOrCreateUser();
        //         chat.addUserToList(username);
        //     }
        // });

        // // Close a connection.
        // $('#close').click(function () {
        //     chat.eachActiveConnection(function (connection) {
        //         connection.close();
        //     });
        // });

        config.gui.messageField.on('keydown', function handle(e) {
            if (e.keyCode === 13) {
                e.preventDefault();

                chat.handleSendMessage();
            }
        });

        config.gui.sendMessageButton.click(function() {
            chat.handleSendMessage();
        });

        window.onunload = window.onbeforeunload = function (e) {
            if (!!chat.peer && !chat.peer.destroyed) {
                chat.peer.disconnect();
            }
        };
    }
});
