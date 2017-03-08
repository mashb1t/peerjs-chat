'use strict';

import Chat from "./chat";


$(document).ready(function() {

    let chat = new Chat();
    chat.start();

    // Prepare file drop box.
    let box = $('#box');
    box.on('dragenter', doNothing);
    box.on('dragover', doNothing);
    box.on('drop', function(e){
        e.originalEvent.preventDefault();
        let file = e.originalEvent.dataTransfer.files[0];
        chat.eachActiveConnection(function(c, $c) {
            if (c.label === 'file') {
                c.send(file);
                $c.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
            }
        });
    });
    function doNothing(e){
        e.preventDefault();
        e.stopPropagation();
    }

    // Connect to a peer
    $('#connect').click(function() {
        let requestedPeer = $('#rid').val();
        if (!chat.connectedPeers[requestedPeer]) {
            // Create 2 connections, one labelled chat and another labelled file.
            let c = chat.peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'none',
                metadata: {message: 'hi i want to chat with you!'}
            });
            c.on('open', function() {
                chat.connect(c);
            });
            c.on('error', function(err) { alert(err); });
            let f = chat.peer.connect(requestedPeer, { label: 'file', reliable: true });
            f.on('open', function() {
                chat.connect(f);
            });
            f.on('error', function(err) { alert(err); });
        }
        chat.connectedPeers[requestedPeer] = 1;
    });

    // Close a connection.
    $('#close').click(function() {
        chat.eachActiveConnection(function(c) {
            c.close();
        });
    });

    // Send a chat message to all active connections.
    $('#send').submit(function(e) {
        e.preventDefault();
        // For each active connection, send the message.
        let msg = $('#text').val();
        chat.eachActiveConnection(function(c, $c) {
            if (c.label === 'chat') {
                c.send(msg);
                $c.find('.messages').append('<div><span class="you">You: </span>' + msg
                    + '</div>');
            }
        });
        $('#text').val('');
        $('#text').focus();
    });

    window.onunload = window.onbeforeunload = function(e) {
        if (!!chat.peer && !chat.peer.destroyed) {
            chat.peer.destroy();
        }
    };
});
