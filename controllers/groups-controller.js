const Menu = require('../views/menu.js');

class GroupsController {
    constructor(chat,backToMain) {
        this.chat = chat;
        this.backToMain = backToMain;
    }

    menu(){
        Menu.ask("*********************************************  \n" +
                 "[c] create new group \n" +
                 "[d] delete group \n" +
                 "[g] get a list of all the groups  \n" +
                 "[s] show group path \n" +
                 "[f] flat group \n" +
                 "[m] back to main menu \n",(input)=>{
            switch (input) {
                case "c": // create group
                    this.createGroup();
                    break;

                case "d": // delete group
                    this.removeGroup();
                    break;

                case "g": // get all groups
                    Menu.log(this.chat.allGroupsNames());
                    this.backToMain();
                    break;

                case "s":
                    this.showGroupPath();
                    this.backToMain();
                    break;

                case "f":
                    this.flatGroup();
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

    createGroup(){
        Menu.ask("enter group name \n",(groupName) => {
            var myGroupName = groupName;
            var foundGroups;
            var chooseGroupMenu;
            if(this.chat._rootIsNull()){
                if(this.chat.addGroup(myGroupName)){
                    Menu.log(`group ${myGroupName} added successfully as root group`);
                    this.backToMain();
                    return;
                }else{
                    Menu.log(`couldn't add group ${myGroupName}`);
                    this.menu();
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
                        this.menu();
                        return;
                    }
                    else if (foundGroups.length == 1){
                        var group = this.chat.getGroupByPath(foundGroups[0]);
                        if(group.groupAlreadyInGroup(myGroupName)){
                            Menu.log(`group ${myGroupName} already in group ${parentGroupName}`);
                            this.menu();
                            return;
                        }
                        if(this.chat.addGroup(myGroupName,foundGroups[0])){
                            Menu.log(`group ${myGroupName} added successfully to group ${parentGroupName}`);
                            this.backToMain();
                            return;
                        }
                        Menu.log(`couldn't add group ${myGroupName}`);
                        this.menu();
                        return;
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
                    if(this.chat.addGroup(myGroupName,foundGroups[chosenPath])){
                        Menu.log(`group ${myGroupName} added successfully`);
                        this.backToMain();
                        return;
                    };
                    Menu.log(`couldn't add group ${myGroupName}`);
                    this.menu();
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
                this.menu();
                return;
            }
            else if (foundGroups.length == 1){
                this.chat.removeGroup(groupName,foundGroups[0]);
                Menu.log(`group ${groupName} removed successfully `);
                this.backToMain();
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
                    this.backToMain();
                    return;
                });
            }
        });
    }

    showGroupPath(){
        Menu.ask("choose group \n",(groupName) => {
            var foundGroups = this.chat.searchGroup(groupName);
            if(foundGroups.length === 0){
                Menu.log("group does not exist");
                this.menu();
            }else{
                Menu.log(foundGroups);
                this.backToMain();
            }

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
                this.menu();
                return;
            }
            else if (foundGroups.length == 1){
                if(this.chat.flatGroup(foundGroups[0])){
                    Menu.log(`group ${groupName} flattened successfully `);
                }
                else{
                    Menu.log(`couldn't flat group ${groupName}`);
                }
                this.menu();
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
                    this.menu();
                    return;
                });
            }
        });
    }
}

module.exports.GroupsController = GroupsController;