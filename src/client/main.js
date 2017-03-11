'use strict';

import Chat from "./chat";


$(document).ready(function () {

    let chat = new Chat();
    chat.start();

    // Prepare file drop box.
    let box = $('#box');
    box.on('dragenter', doNothing);
    box.on('dragover', doNothing);
    box.on('drop', function (e) {
        e.originalEvent.preventDefault();
        let file = e.originalEvent.dataTransfer.files[0];

        chat.eachActiveConnection(function (connection, activeChat) {
            if (connection.label === 'file') {
                connection.send(file);
                activeChat.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
            }
        });
    });

    /**
     * @param e
     */
    function doNothing(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Connect to a peer
     */
    $('#connect').click(function () {
        let username = $('#rid').val();
        if (!chat.getUserFromList(username)) {

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
        }

        chat.addUserToList(username);
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
        chat.eachActiveConnection(function (connection, activeChat) {
            if (connection.label === 'chat') {
                connection.send(msg);
                activeChat.find('.messages').append('<div><span class="you">You: </span>' + msg
                    + '</div>');
            }
        });
        $('#text').val('');
        $('#text').focus();
    });

    window.onunload = window.onbeforeunload = function (e) {
        if (!!chat.peer && !chat.peer.destroyed) {
            chat.peer.destroy();
        }
    };
});
