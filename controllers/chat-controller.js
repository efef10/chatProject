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
        //initial examples
        this.chat.users.users.push(new User("u1",22,"passss"));
        this.chat.users.users.push(new User("u2",22,"passss"));
        this.chat.users.users.push(new User("u3",22,"passss"));

        this.rootMenu();
    }

    rootMenu(){
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
                Menu.log(this.chat.getUsersName());
                this.rootMenu();
                break;

            case "c": // create group
                this.createGroup();
                break;

            case "d": // delete group
                this.removeGroup();
                break;

            case "g": // get all groups
                Menu.log(this.chat.allGroupsNames());
                this.rootMenu();
                break;

            case "a": // add user to group
                this.addUserToGroup();
                break;

            case "e": //delete user from group
                this.removeUserFromGroup();
                break;

            case "l": // get groups and their users
                this.allGroupsAndUsers();
                this.rootMenu();
                break;

            case "u": //update user age
                this.updateAge();
                break;

            case "p": //update password
                this.updatePassword();
                break;

            case "o":
                this.allGroupsOfUser();
                this.rootMenu();
                break;

            case "s":
                this.showGroupPath();
                this.rootMenu();
                break;

            case "f":
                this.flatGroup();
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

    createUser() {
        Menu.ask("what is your username? \n",(userName) => {
            var myUserName = userName;
            var myAge;
            if (this.userNameExists(userName)) {
                Menu.log(`user ${userName} already exists`);
                this.rootMenu();
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
                    this.chat.addUser(myUserName, myAge, password);
                    Menu.log(`user ${userName} added successfully`);
                    this.rootMenu();
                });
            }
        });
    }

    removeUser(){
        Menu.ask("choose username \n",(userName) => {
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.rootMenu();
                return;
            }
            else {
                this.chat.removeUser(userName);
                Menu.log(`user ${userName} removed successfully`);
                this.rootMenu();
                return;
            }
        });
    }

    createGroup(){
        Menu.ask("enter group name \n",(groupName) => {
        var myGroupName = groupName;
        var foundGroups;
        var chooseGroupMenu;
            if(this.chat._rootIsNull()){
                if(this.chat.addGroup(myGroupName)){
                    Menu.log(`group ${myGroupName} added successfully as root group`);
                    this.rootMenu();
                    return;
                }
            }
            else{
                getParentGroup.call(this);
            }

            function getParentGroup(){
                Menu.ask(`in which group do you want to add group ${myGroupName} \n`, (parentGroupName)=> {
                    foundGroups = this.chat.searchGroup(parentGroupName);
                    if (foundGroups.length == 0) {
                        Menu.log(`group ${parentGroupName} does not exist`)
                        this.rootMenu();
                        return;
                    }
                    else if (foundGroups.length == 1){
                        var group = this.chat.getGroupByPath(foundGroups[0]);
                        if(group.groupAlreadyInGroup(myGroupName)){
                            Menu.log(`group ${myGroupName} already in group ${parentGroupName}`);
                            this.rootMenu();
                            return;
                        }
                        this.chat.addGroup(myGroupName,foundGroups[0]);
                        Menu.log(`group ${myGroupName} added successfully to group ${parentGroupName}`);
                        this.rootMenu();
                    }
                    else{
                        chooseGroupMenu = "";
                        for(var i=0;i<foundGroups.length; i++){
                            chooseGroupMenu += `[${i}] - ${foundGroups[i]} \n`;
                        }
                        getChosenPath.call(this);
                    }
                });
            }

            function getChosenPath(){
                Menu.ask(`in which group do you want to add group ${myGroupName} 
${chooseGroupMenu}`, (chosenPath)=> {
                    if(chosenPath>=foundGroups.length){
                        Menu.log("please choose legal option\n");
                        getChosenPath.call(this)
                        return;
                    }
                    this.chat.addGroup(myGroupName,foundGroups[chosenPath]);
                    Menu.log(`group ${myGroupName} added successfully`);
                    this.rootMenu();
                    return;
                });
            }
        });
    }

    removeGroup(){
        Menu.ask("enter group name to delete\n",(groupName) => {
            var myGroupName = groupName;
            var foundGroups;
            var chooseGroupMenu;
            foundGroups = this.chat.searchGroup(groupName);
            if (foundGroups.length == 0) {
                Menu.log(`group ${groupName} does not exist`)
                this.rootMenu();
                return;
            }
            else if (foundGroups.length == 1){
                this.chat.removeGroup(groupName,foundGroups[0]);
                Menu.log(`group ${groupName} removed successfully `);
                this.rootMenu();
            }
            else{
                chooseGroupMenu = "";
                for(var i=0;i<foundGroups.length; i++){
                    chooseGroupMenu += `[${i}] - ${foundGroups[i]} \n`;
                }
                getChosenPath.call(this);
            }

            function getChosenPath(){
                Menu.ask(`which group do you want to remove ? 
${chooseGroupMenu}`, (chosenPath)=> {
                    if(chosenPath>=foundGroups.length){
                        Menu.log("please choose legal option\n");
                        getChosenPath.call(this)
                        return;
                    }
                    this.chat.removeGroup(myGroupName,foundGroups[chosenPath]);
                    Menu.log(`group ${myGroupName} removed successfully`);
                    this.rootMenu();
                    return;
                });
            }
        });
    }

    allGroupsAndUsers(){
        var output = "";
        var gAndU = this.chat.returnGroupsAndUsers();
        for (var i=0;i<gAndU.length;i++){
            for(var j=0;j<gAndU[i].level;j++){
                output+="--";
            }
            var count ="";
            if(gAndU[i].type=="Group")
            {
                count ="("+ (gAndU[i].count).toString() +")";
            }
            output+=gAndU[i].type +":"+gAndU[i].name + count +"\n";

        }
        Menu.log(output);
    }

    userNameExists(userName) {
        if (this.chat.returnUserByName(userName)) {
            return true;
        }
        return false;
    }

    addUserToGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            var myUserName = userName;
            var foundGroups;
            var chooseGroupMenu;
            var parentGroup;
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.rootMenu();
                return;
            }
            else {
               getGroupName.call(this);
            }

            function getGroupName(){
                Menu.ask(`in which group do you want to add user ${myUserName} \n`, (parentGroupName)=> {
                    foundGroups = this.chat.searchGroup(parentGroupName);
                    parentGroup = parentGroupName;
                    if (foundGroups.length == 0) {
                        Menu.log(`group ${parentGroupName} does not exist`)
                        this.rootMenu();
                        return;
                    }
                    else if (foundGroups.length == 1){
                        var group = this.chat.getGroupByPath(foundGroups[0]);
                        if(group.userInGroup(myUserName)){
                            Menu.log(`user ${myUserName} already in group ${parentGroupName}`);
                            this.rootMenu();
                            return;
                        }
                        if(this.chat.addUserToGroup(myUserName,foundGroups[0])){
                            Menu.log(`user ${myUserName} added successfully to group ${parentGroupName}`);
                        }
                        else{
                            Menu.log(`could'nt add user ${myUserName} to group ${parentGroupName}`);
                        }

                        this.rootMenu();
                    }
                    else{
                        chooseGroupMenu = "";
                        for(var i=0;i<foundGroups.length; i++){
                            chooseGroupMenu += `[${i}] - ${foundGroups[i]} \n`;
                        }
                        getChosenPath.call(this);
                    }
                });
            }

            function getChosenPath(){
                Menu.ask(`in which group do you want to add user ${myUserName} 
${chooseGroupMenu}`, (chosenPath)=> {
                    if(chosenPath>=foundGroups.length){
                        Menu.log("please choose legal option\n");
                        getChosenPath.call(this)
                        return;
                    }
                    var group = this.chat.getGroupByPath(foundGroups[chosenPath]);
                    if(group.userInGroup(myUserName)){
                        Menu.log(`user ${myUserName} already in group ${parentGroup}`);
                        this.rootMenu();
                        return;
                    }
                    this.chat.addUserToGroup(myUserName,foundGroups[chosenPath]);
                    Menu.log(`user ${myUserName} added successfully`);
                    this.rootMenu();
                    return;
                });
            }
        });

    }

    removeUserFromGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            var myUserName = userName;
            var foundGroups;
            var chooseGroupMenu;
            var parentGroup;
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.rootMenu();
                return;
            }
            else {
                getGroupName.call(this);
            }

            function getGroupName(){
                Menu.ask(`from which group do you want to remove user ${myUserName} \n`, (parentGroupName)=> {
                    foundGroups = this.chat.searchGroup(parentGroupName);
                    parentGroup = parentGroupName;
                    if (foundGroups.length == 0) {
                        Menu.log(`group ${parentGroupName} does not exist`)
                        this.rootMenu();
                        return;
                    }
                    else if (foundGroups.length == 1){
                        var group = this.chat.getGroupByPath(foundGroups[0]);
                        if(!group.userInGroup(myUserName)){
                            Menu.log(`user ${myUserName} not exists in group ${parentGroupName}`);
                            this.rootMenu();
                            return;
                        }
                        this.chat.removeUserFromGroup(myUserName,foundGroups[0]);
                        Menu.log(`user ${myUserName} removed successfully from group ${parentGroupName}`);
                        this.rootMenu();
                    }
                    else{
                        chooseGroupMenu = "";
                        for(var i=0;i<foundGroups.length; i++){
                            chooseGroupMenu += `[${i}] - ${foundGroups[i]} \n`;
                        }
                        getChosenPath.call(this);
                    }
                });
            }

            function getChosenPath(){
                Menu.ask(`choose group to remove user ${myUserName} 
${chooseGroupMenu}`, (chosenPath)=> {
                    if(chosenPath>=foundGroups.length){
                        Menu.log("please choose legal option\n");
                        getChosenPath.call(this)
                        return;
                    }
                    var group = this.chat.getGroupByPath(foundGroups[chosenPath]);
                    if(!group.userInGroup(myUserName)){
                        Menu.log(`user ${myUserName} not exists in group ${parentGroup}`);
                        this.rootMenu();
                        return;
                    }
                    this.chat.removeUserFromGroup(myUserName,foundGroups[chosenPath]);
                    Menu.log(`user ${myUserName} removed successfully`);
                    this.rootMenu();
                    return;
                });
            }
        });

    }

    updateAge(){
        Menu.ask("enter user name \n",(userName)=>{
            if(!this.userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                this.rootMenu();
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
                        this.chat.setUserAge(userName, age);
                        Menu.log(`user's age was updated successfully`);
                        this.rootMenu();
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
                this.rootMenu();
                return;
            }
            else{
                user = this.chat.returnUserByName(userName);
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
                            this.rootMenu();
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
                    this.chat.setUserPassword(user.getUserName(),password);
                    Menu.log(`user's password was updated successfully`);
                    this.rootMenu();
                });
            }
        });
    }

    allGroupsOfUser(){
        Menu.ask("choose username \n",(userName) => {
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.rootMenu();
                return;
            }
            else {
                Menu.log(this.chat.nameOfAllGroupsOfUser(userName));
                this.rootMenu();
                return;
            }
        });
    }

    showGroupPath(){
        Menu.ask("choose group \n",(groupName) => {
            var foundGroups = this.chat.searchGroup(groupName);
            Menu.log(foundGroups);
            this.rootMenu();
            return;
        });
    }

    flatGroup(){
        Menu.ask("enter group name to flat\n",(groupName) => {
            var myGroupName = groupName;
            var foundGroups;
            var chooseGroupMenu;
            foundGroups = this.chat.searchGroup(groupName);
            if (foundGroups.length == 0) {
                Menu.log(`group ${groupName} does not exist`)
                this.rootMenu();
                return;
            }
            else if (foundGroups.length == 1){
                if(this.chat.flatGroup(foundGroups[0])){
                    Menu.log(`group ${groupName} flattened successfully `);
                }
                else{
                    Menu.log(`couldn't flat group ${groupName}`);
                }
                this.rootMenu();
                return;
            }
            else{
                chooseGroupMenu = "";
                for(var i=0;i<foundGroups.length; i++){
                    chooseGroupMenu += `[${i}] - ${foundGroups[i]} \n`;
                }
                getChosenPath.call(this);
            }

            function getChosenPath(){
                Menu.ask(`which group do you want to flat ? 
${chooseGroupMenu}`, (chosenPath)=> {
                    if(this.chat.flatGroup(foundGroups[chosenPath])){
                        Menu.log(`group ${myGroupName} flattened successfully `);
                    }
                    else{
                        Menu.log(`couldn't flat group ${myGroupName}`);
                    }
                    this.rootMenu();
                    return;
                });
            }
        });
    }
}

module.exports.ChatController = ChatController;