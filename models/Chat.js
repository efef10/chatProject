const {Users}    = require('../models/Users.js');
const {Groups}   = require('../models/Groups.js');
const {Group}   = require('../models/Group.js');

 class Chat{

     constructor() {
         this.root = null;//new Group("root");

     }

    //  getUsers(){
    //     return this.myUsers;
    // }

    //  getGroups(){
    //     return this.myGroups;
    // }

     addUserToGroup(userName,groupName){
        var user = this.searchUser(userName);
        var group = this.searchGroup(groupName);
        if(!!user && !!group){
            group.addUser(user);
            var listener = {fn:this._removeUserFromGroup,
                            user:user,
                            group:group};
            user.removeUserEvent.subscribe(listener);
            return true;
        }
        else{
            return false;
        }

    }

     removeUserFromGroup(userName,groupName){
        var user = this.myUsers.returnUserByName(userName);
        var group = this.myGroups.returnGroupByName(groupName);
        if(!!user && !!group){
            group.removeUser(user);
            user.removeUserEvent.unsubscribe(group);
            return true;
        }
        else{
            return false;
        }

    }

     _removeUserFromGroup(user,group){
         if(!!user && !!group){
             group.removeUser(user.getUserName());
             return true;
         }
         else{
             return false;
         }

     }

     addGroup(newGroupName, parentGroupName){
         var group = this.searchGroup(parentGroupName);
         if (!!group){
             group.addGroup(newGroupName);
             return true;
         }
         else{
             return false;
         }
     }

     searchGroup(groupName, currentGroup){
         var group = currentGroup;
         if (currentGroup === undefined){
             group = this.root;
         }
         if((group.getGroupName() === groupName) && (group !==  this.root)){
             return group;
         }
         if((!group.hasChildren()) || (group.getChildren()[0] instanceof User)){
             return -1;
         }
         var children = group.getChildren();
         for(var i=0 ; children.length; i++){
             var groupFound = search(groupName, children[i]);
             if(groupFound !== -1){
                 return groupFound;
             }
         }
         return -1;

     }

     searchUser(userName, currentGroup){
         var group = currentGroup;
         if (currentGroup === undefined){
             group = this.head;
         }
         if(group.getGroupName() === groupName){
             return group;
         }
         if((!group.hasChildren()) || (group.getChildren()[0] instanceof User)){
             return -1;
         }
         var children = group.getChildren();
         for(var i=0 ; children.length; i++){
             var groupFound = search(groupName, children[i]);
             if(groupFound !== -1){
                 return groupFound;
             }
         }
         return -1;

     }
    }


module.exports.Chat = Chat;