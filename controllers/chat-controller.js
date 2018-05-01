const {Users} = require('../models/Users.js');
const {Groups} = require('../models/Groups.js');
const {User} = require('../models/User.js');
const {Group} = require('../models/Group.js');
const {Chat} = require('../models/Chat.js');
const Menu = require('../views/menu.js');

function ChatController() {
    const chat = new Chat();

    return{
        init
    };

    function init() {
        Menu.RootMenu(decision);
    }

    function decision (input) {
        switch (input) {
            case "n": // new user
                createUser();
                break;

            case "r": // remove user
                removeUser();
                break;

            case "v": //view users
                Menu.log(chat.getUsers().allUsersNames());
                init();
                break;

            case "c": // create group
                createGroup();
                break;

            case "d": // delete group
                removeGroup();
                break;

            case "g": // get all groups
                Menu.log(chat.getGroups().allGroupsNames());
                init();
                break;

            case "l": // get groups and their users
                allGroupsAndUsers();
                init();
                break;

            case "a": // add user to group
                addUserToGroup();
                break;

            case "e": //delete user from group
                removeUserFromGroup();
                break;

            case "u": //update user age
                updateAge();
                //init();
                break;

            case "p": //update password
                updatePassword();
                init();
                break;

            case "q": // quit
                Menu.quit();
                break;

            default: {
                Menu.log("please choose a letter from the menu");
                init();
            }
        }
    }

    function createUser() {
        Menu.ask("what is your username? \n",(userName) => {
            var myUserName = userName;
            var myAge;
            if (userNameExists(userName)) {
                Menu.log(`user ${userName} already exists`);
                init();
                return;
            }
            else {
                getUserAge();
            }

            function getUserAge() {
                Menu.ask("what is your age? \n",(age) => {
                    if (isNaN(age)) {
                        Menu.log(`please enter numeric value`)
                        getUserAge();
                    }
                    else {
                        myAge = age;
                        getUserPassword();
                    }
                });
            }

            function getUserPassword() {
                Menu.ask("enter password? \n",(password) => {
                    chat.getUsers().addUser(myUserName, myAge, password);
                    Menu.log(`user ${userName} added successfully`);
                    init();
                });
            }
        });
    }

    function removeUser(){
        Menu.ask("choose username \n",(userName) => {
            if (!userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                init();
                return;
            }
            else {
                chat.getUsers().removeUser(userName);
                Menu.log(`user ${userName} removed successfully`);
                init();
                return;
            }
        });
    }

    function createGroup(){
        Menu.ask("enter group name \n",(groupName) => {
            if (groupNameExists(groupName)) {
                Menu.log(`group ${groupName} already exists`)
                init();
                return;
            }
            else {
                chat.getGroups().addGroup(groupName);
                Menu.log(`group ${groupName} added successfully`);
                init();
                return;
            }
        });
    }

    function removeGroup(){
        Menu.ask("choose group \n",(groupName) => {
            if (!groupNameExists(groupName)) {
                Menu.log(`group ${groupName} not exists`)
                init();
                return;
            }
            else {
                chat.getGroups().removeGroup(groupName);
                Menu.log(`group ${groupName} removed successfully`);
                init();
                return;
            }
        });
    }

    function allGroupsAndUsers(){
        var groups = chat.getGroups().allGroups();
        for (var i=0 ; i<groups.length ; i++){
            Menu.log("group " + groups[i].groupName + ":");
            var currentGroupUsers = groups[i].getUsers();
            if(!!currentGroupUsers) {
                for (var j = 0; j < currentGroupUsers.length; j++) {
                    Menu.log(currentGroupUsers[j].getUserName() + ", Age: " + currentGroupUsers[j].getAge());
                }
            }
        }
    }

    function userNameExists(userName) {
        if (chat.getUsers().returnUserByName(userName)) {
            return true;
        }
        return false;
    }

    function groupNameExists(groupName) {
        if (chat.getGroups().returnGroupByName(groupName)) {
            return true;
        }
        return false;
    }

    function addUserToGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            if (!userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                init();
                return;
            }
            else {
               getGroupName();
            }

            function getGroupName(){
                Menu.ask("please enter group name \n",(groupName)=>{
                    if (!groupNameExists(groupName)) {
                        Menu.log(`group ${groupName} not exists`)
                        init();
                        return;
                    }
                    else if(chat.getGroups().returnGroupByName(groupName).indexOfUserInGroup(userName) >= 0){
                        Menu.log(`user ${userName} already in group ${groupName}`)
                        init();
                        return;
                    }
                    else{
                        chat.addUserToGroup(userName,groupName);
                        Menu.log(`user ${userName} added successfully to group ${groupName}`);
                        init();
                        return
                    }
                });
            }
        });
    }

    function removeUserFromGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            if (!userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                init();
                return;
            }
            else {
                getGroupName();
            }

            function getGroupName(){
                Menu.ask("please enter group name \n",(groupName)=>{
                    if (!groupNameExists(groupName)) {
                        Menu.log(`group ${groupName} not exists`)
                        init();
                        return;
                    }
                    else if((chat.getGroups().returnGroupByName(groupName).indexOfUserInGroup(userName)) === -1){
                        Menu.log(`user ${userName} not in group ${groupName}`)
                        init();
                        return;
                    }
                    else{
                        chat.removeUserFromGroup(userName,groupName);
                        Menu.log(`user ${userName} removed successfully from group ${groupName}`);
                        init();
                        return
                    }
                });
            }
        });
    }

    function updateAge(){
        Menu.ask("enter user name \n",(userName)=>{
            if(!userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                init();
                return;
            }
            else{
                getNewAge();
            }

            function getNewAge(){
                Menu.ask("enter new age \n",(age)=>{
                    if (isNaN(age)) {
                        Menu.log(`please enter numeric value`);
                        getNewAge();
                    }
                    else {
                        chat.getUsers().returnUserByName(userName).setAge(age);
                        Menu.log(`user's age was updated successfully`);
                        init();
                    }
                });
            }
        });
    }

    function updatePassword(){
        Menu.ask("enter user name \n",(userName)=>{
            var user;
            if(!userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                init();
                return;
            }
            else{
                user = chat.getUsers().returnUserByName(userName);
                getOldPassword(3);
            }

            function getOldPassword(tries){
                Menu.ask("enter old password \n",(password)=>{
                    if (user.getPassword()===password) {
                        getNewPassword();
                    }
                    else {
                        if(tries === 0){
                            Menu.log(`error, change password failed due to too much wrong tries`);
                            init();
                            return;
                        }else{
                            Menu.log(`entered password does not match old password, you have ${tries} tries left`);
                            getOldPassword(tries-1);
                        }
                    }
                });
            }

            function getNewPassword(){
                Menu.ask("enter new password \n",(password)=>{
                    chat.getUsers().returnUserByName(userName).setPassword(password);
                    Menu.log(`user's password was updated successfully`);
                    init();
                });
            }
        });
    }
}

module.exports.ChatController = ChatController;