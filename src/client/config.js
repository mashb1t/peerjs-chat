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
        sendFileButton: $('#send-file'), //inactive
        fileUploadField: $('#fileupload'), //inactive
        emojiButton: $('#emoji'), //inactive
        logField: $('.log'),
        lightbox: function() {},
    },
    peerjs: {
        username: $('#username').text(),
        options: {
            host: window.location.hostname,
            port: 9000,
            path: "/",
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