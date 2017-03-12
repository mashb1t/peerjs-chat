'use strict';

import Factory from "../factory";
import config from "../config";

/**
 * Domain object for chat users
 */
class UserList {

    /**
     * @type {{User}}
     * @private
     */
    static _userList = {};

    /**
     * @type {User}
     * @private
     */
    static _currentUser = null;

    /**
     * @param username
     */
    static getUser(username) {
        return UserList.userList[username];
    }

    /**
     * @param username
     * @returns {User}
     */
    static getOrCreateUser(username) {
        let user = UserList.getUser(username);

        if (!user) {
            user = Factory.createUser(username);
            UserList.addUser(user);
        }

        return user;
    }

    /**
     * @param user
     */
    static addUser(user) {
        UserList.userList[user.name] = user;
    }

    /**
     * Add user to userlist in gui
     *
     * @param user
     * @param clickFunctionCallback
     */
    static addUserToGui(user, clickFunctionCallback) {
        let userListEntry = $('<li class="user disconnected" id="' + user.name + '">' +
            '<img class="gravatar" src="' + user.image + '">' +
            '<span class="name">' + user.name + '</span>' +
            '</li>');

        if (clickFunctionCallback) {
            userListEntry.click(clickFunctionCallback);
        }

        config.gui.userlist.append(userListEntry);
    }

    static getGuiUserListEntry(user) {
        return config.gui.userlist.find('#' + user.name);
    }

    /**
     * @param user
     */
    static deleteUser(user) {
        delete UserList.userList[user.name];
    }

    /**
     * @returns {{User}}
     */
    static get userList() {
        return this._userList;
    }

    /**
     * Marks user as active in gui userlist
     *
     * @param user
     */
    static markUserActive(user) {
        // inactivate all users in userlist
        config.gui.userlist.find('.user').each(function (index, element) {
            $(element).removeClass('active');
        });

        // activate user list entry of given user
        let userListEntries = config.gui.userlist.find('#' + user.name);
        userListEntries.each(function (index, element) {
            $(element).addClass('active');
        });
    }

    /**
     * @returns {User}
     */
    static get currentUser() {
        return this._currentUser;
    }

    /**
     * @type {User}
     * @param value
     */
    static set currentUser(value) {
        this._currentUser = value;
    }
}

export default UserList;