import Utils from "./utils";

let config = {
    gui: {
        errorField: $('.chat-errors'),
        userlist: $('.userlist'),
        activeChatHeadline: $('.active-chat-headline'),
        messageList: $('.message-container'),
        messageField: $('#message-field'),
        sendMessageButton: $('#send-message'),
        refreshUsersButton: $('#refresh'), //inactive
        closeConnectionButton: $('#close-connection'), //inactive
        videoChatButton: $('#video-chat'), //inactive
        sendFileButton: $('#send-file'),
        fileUploadField: $('#fileupload'), //inactive
        emojiButton: $('#emoji'), //inactive
        logField: $('.log'),
        lightbox: function() {},
    },
    peerjs: {
        username: $('#chat').find('#username').val(),
        options: {
            host: 'chat.mash1t.de',
            port: 443,
            path: "/",
            secure: true,
            debug: 3,
            logFunction: function () {
                let copy = Array.prototype.slice.call(arguments).join(' ');
                config.gui.logField.append(copy + '<br>');
            },
        }
    },
    encryption: {
        bits: 1024
    }
};

export default config;