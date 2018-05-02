const {Users} = require('../models/Users.js');
const {Groups} = require('../models/Groups.js');
const {User} = require('../models/User.js');
const {Group} = require('../models/Group.js');
const {Chat} = require('../models/Chat.js');
const Menu = require('../views/menu.js');

class ChatController{
    constructor() {
        this.chat = new Chat();
    }

    init() {
        Menu.RootMenu(this.decision.bind(this));
    }

    decision (input) {
        switch (input) {
            case "n": // new user
                this.createUser();
                break;

            case "r": // remove user
                this.removeUser();
                break;

            case "v": //view users
                Menu.log(this.chat.getUsers().allUsersNames());
                this.init();
                break;

            case "c": // create group
                this.createGroup();
                break;

            case "d": // delete group
                this.removeGroup();
                break;

            case "g": // get all groups
                Menu.log(this.chat.getGroups().allGroupsNames());
                this.init();
                break;

            case "l": // get groups and their users
                this.allGroupsAndUsers();
                this.init();
                break;

            case "a": // add user to group
                this.addUserToGroup();
                break;

            case "e": //delete user from group
                this.removeUserFromGroup();
                break;

            case "u": //update user age
                this.updateAge();
                break;

            case "p": //update password
                this.updatePassword();
                break;

            case "q": // quit
                Menu.quit();
                break;

            default: {
                Menu.log("please choose a letter from the menu");
                this.init();
            }
        }
    }

    createUser() {
        Menu.ask("what is your username? \n",(userName) => {
            // console.log('create user this', this);
            var myUserName = userName;
            var myAge;
            if (this.userNameExists(userName)) {
                Menu.log(`user ${userName} already exists`);
                this.init();
                return;
            }
            else {
                getUserAge.call(this);
            }

            function getUserAge() {
                // console.log('user age this', this);
                Menu.ask("what is your age? \n",(age) => {
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
                Menu.ask("enter password? \n",(password) => {
                    this.chat.getUsers().addUser(myUserName, myAge, password);
                    Menu.log(`user ${userName} added successfully`);
                    this.init();
                });
            }
        });
    }

    removeUser(){
        Menu.ask("choose username \n",(userName) => {
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.init();
                return;
            }
            else {
                this.chat.getUsers().removeUser(userName);
                Menu.log(`user ${userName} removed successfully`);
                this.init();
                return;
            }
        });
    }

    createGroup(){
        Menu.ask("enter group name \n",(groupName) => {
            var myGroupName = groupName;
            if (this.chat.searchGroup(groupName) !== -1) {
                Menu.log(`group ${groupName} already exists`)
                this.init();
                return;
            }
            else{
                getParentGroup.call(this);
            }

            function getParentGroup(){
                Menu.ask(`in which group do you want to add group ${myGroupName} \n`, (parentGroupName)=>{
                    if (this.chat.searchGroup(parentGroupName) === -1) {
                        Menu.log(`group ${parentGroupName} does not exist`)
                        this.init();
                        return;
                    }
                    else{
                        if(this.chat.addGroup(myGroupName, parentGroupName));{
                            Menu.log(`group ${myGroupName} added successfully to group ${parentGroupName}`);
                            this.init();
                            return;
                        }
                    }
                });
            }

        });
    }

    removeGroup(){
        Menu.ask("choose group \n",(groupName) => {
            if (!this.groupNameExists(groupName)) {
                Menu.log(`group ${groupName} not exists`)
                this.init();
                return;
            }
            else {
                this.chat.getGroups().removeGroup(groupName);
                Menu.log(`group ${groupName} removed successfully`);
                this.init();
                return;
            }
        });
    }

    allGroupsAndUsers(){
        var groups = this.chat.getGroups().allGroups();
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

    userNameExists(userName) {
        if (this.chat.getUsers().returnUserByName(userName)) {
            return true;
        }
        return false;
    }

    groupNameExists(groupName) {
        if (this.chat.getGroups().returnGroupByName(groupName)) {
            return true;
        }
        return false;
    }

    addUserToGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.init();
                return;
            }
            else {
               getGroupName.call(this);
            }

            function getGroupName(){
                Menu.ask("please enter group name \n",(groupName)=>{
                    if (!this.groupNameExists(groupName)) {
                        Menu.log(`group ${groupName} not exists`)
                        this.init();
                        return;
                    }
                    else if(this.chat.getGroups().returnGroupByName(groupName).indexOfUserInGroup(userName) >= 0){
                        Menu.log(`user ${userName} already in group ${groupName}`)
                        this.init();
                        return;
                    }
                    else{
                        this.chat.addUserToGroup(userName,groupName);
                        Menu.log(`user ${userName} added successfully to group ${groupName}`);
                        this.init();
                        return
                    }
                });
            }
        });
    }

    removeUserFromGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.init();
                return;
            }
            else {
                getGroupName.call(this);
            }

            function getGroupName(){
                Menu.ask("please enter group name \n",(groupName)=>{
                    if (!this.groupNameExists(groupName)) {
                        Menu.log(`group ${groupName} not exists`)
                        this.init();
                        return;
                    }
                    else if((this.chat.getGroups().returnGroupByName(groupName).indexOfUserInGroup(userName)) === -1){
                        Menu.log(`user ${userName} not in group ${groupName}`)
                        this.init();
                        return;
                    }
                    else{
                        this.chat.removeUserFromGroup(userName,groupName);
                        Menu.log(`user ${userName} removed successfully from group ${groupName}`);
                        this.init();
                        return
                    }
                });
            }
        });
    }

    updateAge(){
        Menu.ask("enter user name \n",(userName)=>{
            if(!this.userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                this.init();
                return;
            }
            else{
                getNewAge.call(this);
            }

            function getNewAge(){
                Menu.ask("enter new age \n",(age)=>{
                    if (isNaN(age)) {
                        Menu.log(`please enter numeric value`);
                        getNewAge.call(this);
                    }
                    else {
                        this.chat.getUsers().returnUserByName(userName).setAge(age);
                        Menu.log(`user's age was updated successfully`);
                        this.init();
                    }
                });
            }
        });
    }

    updatePassword(){
        Menu.ask("enter user name \n",(userName)=>{
            var user;
            if(!this.userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                this.init();
                return;
            }
            else{
                user = this.chat.getUsers().returnUserByName(userName);
                getOldPassword.call(this,3);
            }

            function getOldPassword(tries){
                Menu.ask("enter old password \n",(password)=>{
                    if (user.getPassword()===password) {
                        getNewPassword.call(this);
                    }
                    else {
                        if(tries === 0){
                            Menu.log(`error, change password failed due to too much wrong tries`);
                            this.init();
                            return;
                        }else{
                            Menu.log(`entered password does not match old password, you have ${tries} tries left`);
                            getOldPassword.call(this,tries-1);
                        }
                    }
                });
            }

            function getNewPassword(){
                Menu.ask("enter new password \n",(password)=>{
                    this.chat.getUsers().returnUserByName(userName).setPassword(password);
                    Menu.log(`user's password was updated successfully`);
                    this.init();
                });
            }
        });
    }
}

module.exports.ChatController = ChatController;