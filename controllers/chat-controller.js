const {User} = require('../models/User.js');
const {Group} = require('../models/Group.js');
const {Chat} = require('../models/Chat.js');
const Menu = require('../views/menu.js');
const {UsersController} = require('./users-controller.js');
const {GroupsController} = require('./groups-controller.js');
const {GroupsUsersController} = require('./groups-users-controller.js');

class ChatController{
    constructor() {
        this.chat = new Chat();
        this.usersController       = new UsersController(this.chat,this.rootMenu.bind(this));
        this.groupsController      = new GroupsController(this.chat,this.rootMenu.bind(this));
        this.groupsUsersController = new GroupsUsersController(this.chat,this.rootMenu.bind(this));
    }

    init() {
        //initial examples
        this.chat.users.users.push(new User("u1",22,"passss"));
        this.chat.users.users.push(new User("u2",22,"passss"));
        this.chat.users.users.push(new User("u3",22,"passss"));

        this.rootMenu();
    }

    rootMenu(){
        Menu.RootMenu(this.decision.bind(this));
    }

    decision(input){
        switch (input) {
            case "u": // users
                this.usersController.menu(this.rootMenu.bind(this));
                break;

            case "g": // groups
                this.groupsController.menu(this.rootMenu.bind(this));
                break;

            case "a": // groups & users
                this.groupsUsersController.menu(this.rootMenu.bind(this));
                break;

            case "q": // quit
                Menu.quit();
                break;

            default: {
                Menu.log("please choose a letter from the menu");
                this.rootMenu();
            }
        }
    }

}

module.exports.ChatController = ChatController;