'use strict';

class Utils {

    static appendAndScrollDown(activeChat, content) {
        activeChat.append(content);
        activeChat.animate({scrollTop: activeChat[0].scrollHeight}, 1000);
    }
}

export default Utils;
