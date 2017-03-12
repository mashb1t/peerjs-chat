import Utils from "./utils";

let config = {
    gui: {
        errorField: $('.chat-errors'),
        userlist: $('.userlist'),
        activeChatHeadline: $('.active-chat-headline'),
        messageList: $('.message-container'),
        messageField: $('#message-field'),//inactive
        refreshUsersButton: $('#refresh'), //inactive
        closeConnectionButton: $('#close-connection'), //inactive
        videoChatButton: $('#video-chat'), //inactive
        uploadButton: $('#fileupload'), //inactive
        emojiButton: $('#emoji'), //inactive
    },
    peerjs: {
        username: $('#username').text(),
        options: {
            host: window.location.hostname,
            port: 9000,
            path: "/",
            debug: 3,
            logFunction: Utils.logFunction
        }
    },
    encryption: {
        bits: 1024
    }
};

export default config;