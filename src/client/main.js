'use strict';

import Chat from "./chat";
import Utils from "./utils";
import config from "./config";

$(function () {

    if (Utils.checkCompatibility()) {

        let chat = new Chat();
        chat.start();

        // Prepare file drop box.
        let box = $('#box');
        box.on('dragenter', Utils.doNothing);
        box.on('dragover', Utils.doNothing);
        box.on('drop', function (e) {
            e.originalEvent.preventDefault();
            let file = e.originalEvent.dataTransfer.files[0];

            chat.eachActiveConnection(function (connection, activeChat) {
                if (connection.label === 'file') {
                    let fileWithMetaData = {
                        filename: file.name,
                        type: file.type,
                        file: file
                    };
                    connection.send(fileWithMetaData);

                    let htmlString = Utils.createBlobHtmlView(file, file.type, file.name);

                    if (htmlString) {
                        Utils.appendAndScrollDown(activeChat, '<div><span class="file">You sent a file:' + htmlString + '</span></div>');
                    }
                }
            });
        });

        /**
         * Connect to a peer
         */
        $('#connect').click(function () {
            let username = $('#rid').val();
            if (!chat.getUserFromList(username) && username !== config.peerjs.username) {

                // Create 2 connections, one labelled chat and another labelled file.
                let dataConnection = chat.peer.connect(username, {
                    label: 'chat',
                    serialization: 'none',
                    metadata: {message: 'hi i want to chat with you!'}
                });
                dataConnection.on('open', function () {
                    chat.connect(dataConnection);
                });
                dataConnection.on('error', function (err) {
                    alert(err);
                });


                let fileConnection = chat.peer.connect(username, {
                    label: 'file', reliable: true
                });

                fileConnection.on('open', function () {
                    chat.connect(fileConnection);
                });

                fileConnection.on('error', function (err) {
                    alert(err);
                });

                let user = chat.getOrCreateUser();
                chat.addUserToList(username);
            } else {
                if (username == config.peerjs.username) {
                    alert('You can\'t connect to yourself!');
                } else {
                    alert('You are already connected to ' + username);
                }
            }
        });

        // Close a connection.
        $('#close').click(function () {
            chat.eachActiveConnection(function (connection) {
                connection.close();
            });
        });

        // Send a chat message to all active connections.
        $('#send').submit(function (e) {
            e.preventDefault();
            // For each active connection, send the message.
            let msg = $('#text').val();

            if (msg) {
                chat.eachActiveConnection(function (connection, activeChat) {
                    if (connection.label === 'chat') {
                        connection.send(msg);
                        Utils.appendAndScrollDown(activeChat, '<div><span class="you">You: </span>' + msg + '</div>');
                    }
                });
            }
            $('#text').val('');
            $('#text').focus();
        });

        window.onunload = window.onbeforeunload = function (e) {
            if (!!chat.peer && !chat.peer.destroyed) {
                chat.peer.connect()
            }
        };
    }
});
