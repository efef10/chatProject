const {Users} = require('../models/Users.js');
const {Groups} = require('../models/Groups.js');
const {Chat} = require('../models/Chat.js');
const Menu = require('../views/menu.js');

class ChatController {
    constructor() {
        this.chat = new Chat();
    }

    init() {
        // Menu.RootMenu( (input) =>{
        //     this.decision(input);
        // });
        Menu.RootMenu(this.decision);
    }

    decision(input) {
        switch (input) {
            case "n": // new user
                this.createUser();
                break;

            case "r": // remove user
                removeUserMessage();
                break;

            case "v": //view users
                console.log(myUsers.allUsersNames());
                main();
                break;

            case "c": // create group
                Menu.createGroupMessage(function (input) {
                    if (this.groupExist(input)) {
                        console.log("hi");
                    }
                });
                break;

            case "d": // delete group
                removeGroupMessage();
                break;

            case "g": // get all groups
                console.log(myGroups.allGroupsNames());
                main();
                break;

            case "l": // get groups and their users
                myUsersToGroups.allGroupsAndUsers();
                main();
                break;

            case "a": // add user to group
                addUserToGroupMessage();
                break;

            case "e": //delete user from group
                removeUserFromGroupMessage();
                break;

            case "u": //update user age
                updateAgeMessage();
                main();
                break;

            case "p": //update password
                updatePasswordMessage();
                main();
                break;

            case "q": // quit
                rl.close();
                break;

            default: {
                console.log("please choose a letter from the menu");
                main();
            }
        }
    };

    createUser() {
        Menu.askForUserName((userName) => {
            var myUserName = userName;
            var myAge;
            if (this.userNameExists(userName)) {
                Menu.log(`user ${userName} already exists`)
                this.init();
            }
            else {
                getUserAge.call(this);
            }

            function getUserAge() {
                Menu.askForAge((age) => {
                    if (isNaN(age)) {
                        Menu.log(`please enter numeric value`)
                        getUserAge.call(this);
                    }
                    else {
                        myAge = age;
                        getUserPassword.call(this);
                    }
                });
            }

            function getUserPassword() {
                Menu.askForPassword((password) => {
                    this.chat.users.addUser(myUserName, myAge, password);
                    Menu.log(`user ${userName} added successfully`);
                    this.init();
                });
            }
        });
    }

    getUserName() {
        Menu.askForUserName((userName) => {
            if (this.userNameExists(userName)) {
                Menu.log(`user ${userName} already exists`)
                this.init();
            }
            else {
                return userName;
            }
        });
    }

    getUserAge() {
        Menu.askForAge((age) => {
            if (isNaN(age)) {
                Menu.log(`please enter numeric value`)
                getUserAge();
            }
            else {
                return age;
            }
        });
    }

    getUserPassword() {
        Menu.askForPassword((password) => {
            return password;
            // this.chat.users.addUser(myUserName, myAge, password);
            // Menu.log(`user ${userName} added successfully`);
            // this.init();
        });
    }


    userNameExists(userName) {
        if (this.chat.getUsers().returnUserByName(userName)) {
            return true;
        }
        return false;
    }

    groupExist(groupName) {
        if (this.chat.getGroups().returnGroupByName(groupName)) {
            return true;
        }
        return false;
    }
}

module.exports.ChatController = ChatController;