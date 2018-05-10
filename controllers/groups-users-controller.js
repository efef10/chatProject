const Menu = require('../views/menu.js');

class GroupsUsersController {
    constructor(chat,backToMain) {
        this.chat = chat;
        this.backToMain = backToMain;
    }

    menu(){
        Menu.ask("*********************************************  \n" +
                 "[a] add user to group \n" +
                 "[d] delete user from group \n" +
                 "[l] get a list of all the groups and users  \n" +
                 "[g] all groups of user \n" +
                 "[m] back to main menu \n",(input)=>{
            switch (input) {
                case "a": // add user to group
                    this.addUserToGroup();
                    break;

                case "d  ": //delete user from group
                    this.removeUserFromGroup();
                    break;

                case "l": // get groups and their users
                    this.allGroupsAndUsers();
                    this.backToMain();
                    break;

                case "g":
                    this.allGroupsOfUser();
                    this.backToMain();
                    break;

                case "m": // back to menu
                    this.backToMain();
                    break;

                default: {
                    Menu.log("please choose a letter from the menu");
                    this.menu();
                }
            }
        });
    }

    allGroupsAndUsers(){
        var output = "";
        var gAndU = this.chat.returnGroupsAndUsers();
        for (var i=gAndU.length-1;i>=0;i--){
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

    addUserToGroup(){
        Menu.ask("please enter userName \n", (userName)=>{
            var myUserName = userName;
            var foundGroups;
            var chooseGroupMenu;
            var parentGroup;
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.menu();
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
                        this.menu();
                        return;
                    }
                    else if (foundGroups.length == 1){
                        var group = this.chat.getGroupByPath(foundGroups[0]);
                        if(group.userInGroup(myUserName)){
                            Menu.log(`user ${myUserName} already in group ${parentGroupName}`);
                            this.menu();
                            return;
                        }
                        if(this.chat.addUserToGroup(myUserName,foundGroups[0])){
                            Menu.log(`user ${myUserName} added successfully to group ${parentGroupName}`);
                        }
                        else{
                            Menu.log(`could'nt add user ${myUserName} to group ${parentGroupName}`);
                        }

                        this.menu();
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
                        this.menu();
                        return;
                    }
                    if(this.chat.addUserToGroup(myUserName,foundGroups[chosenPath])){
                        Menu.log(`user ${myUserName} added successfully `);
                    }
                    else{
                        Menu.log(`could'nt add user ${myUserName}`);
                    }
                    this.menu();
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
                this.menu();
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
                        this.menu();
                        return;
                    }
                    else if (foundGroups.length == 1){
                        var group = this.chat.getGroupByPath(foundGroups[0]);
                        if(!group.userInGroup(myUserName)){
                            Menu.log(`user ${myUserName} not exists in group ${parentGroupName}`);
                            this.menu();
                            return;
                        }
                        this.chat.removeUserFromGroup(myUserName,foundGroups[0]);
                        Menu.log(`user ${myUserName} removed successfully from group ${parentGroupName}`);
                        this.backToMain();
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
                        this.menu();
                        return;
                    }
                    this.chat.removeUserFromGroup(myUserName,foundGroups[chosenPath]);
                    Menu.log(`user ${myUserName} removed successfully`);
                    this.backToMain();
                    return;
                });
            }
        });

    }

    allGroupsOfUser(){
        Menu.ask("choose username \n",(userName) => {
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.menu();
                return;
            }
            else {
                Menu.log(this.chat.nameOfAllGroupsOfUser(userName));
                this.backToMain();
                return;
            }
        });
    }

    userNameExists(userName) {
        if (this.chat.returnUserByName(userName)) {
            return true;
        }
        return false;
    }
}

module.exports.GroupsUsersController = GroupsUsersController;