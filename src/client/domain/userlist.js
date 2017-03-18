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
        if (!UserList.getGuiUserListEntry(user)) {
            let userListEntry = $('<li class="user disconnected" id="' + user.name + '">' +
                '<img class="gravatar" src="' + user.image + '">' +
                '<span class="name">' + user.name + '</span>' +
                '</li>');

            if (clickFunctionCallback) {
                userListEntry.click(clickFunctionCallback);
            }

            config.gui.userlist.append(userListEntry);
        }
    }

    static getGuiUserListEntry(user) {
        return config.gui.userlist.find('#' + user.name)[0];
    }

    /**
     * @param user
     */
    static deleteUser(user) {
        // delete UserList.userList[user.name];
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
        let guiUserList = config.gui.userlist.find('.user');
        for (let userListEntry of guiUserList) {
            $(userListEntry).removeClass('active');
        }

        let userListEntry = UserList.getGuiUserListEntry(user);
        $(userListEntry).addClass('active');
    }

    /**
     * Marks user as connected in gui userlist
     *
     * @param user
     */
    static markUserConnected(user) {
        // inactivate all users in userlist
        let userListEntry = UserList.getGuiUserListEntry(user);
        $(userListEntry).removeClass('disconnected').addClass('connected');
    }

    /**
     * Marks user as disconnected in gui userlist
     *
     * @param user
     */
    static markUserDisonnected(user) {
        let userListEntry = UserList.getGuiUserListEntry(user);
        $(userListEntry).removeClass('connected').addClass('disconnected');
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