import Utils from "./utils";

let config = {
    gui: {
        errorField: $('.chat-errors'),
        userlist: $('.userlist'),
        messagesList: $('.message-container'),
        activeChatHeadline: $('.active-chat-headline'),
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