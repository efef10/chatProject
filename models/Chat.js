const {Users}    = require('../models/Users.js');
const {User}    = require('../models/User.js');
const {Group}   = require('../models/Group.js');

 class Chat{

     constructor() {
         this.root = null;
         this.users = new Users();
     }

    _rootIsNull(){
         return this.root === null;
    }

     addUser(userName,age,password){
         return this.users.addUser(userName,Number(age),password);
     }

     removeUser(userName){
         var groups = this.allGroupsOfUser(userName);
         for(var i=0 ; i<groups.length ; i++){
             groups[i].removeUser(userName);
         }
         return this.users.removeUser(userName);
     }

     nameOfAllGroupsOfUser(userName){
         return this.allGroupsOfUser(userName).map(function (group) {
             if (!!group) {
                 return group.groupName;
             }
         });
     }

     allGroupsOfUser(userName, arr, currentGroup){
         var foundGroups = arr || [];
         var group = currentGroup;
         if(group === undefined){
             group = this.root;
         }
         if (group === null || !group.hasChildren()){
             return foundGroups;
         }
         var children = group.getChildren();
         if(children[0] instanceof User){
             for (var i=0 ; i<children.length; i++){
                 if(children[i].getUserName()===userName){
                     foundGroups.push(group);
                     break;
                 }
             }
         }
         else{
             for (var i=0 ; i<children.length; i++){
                 this.allGroupsOfUser(userName, foundGroups, children[i]);
             }
         }
         return foundGroups;
     }

     addUserToGroup(userName,path){
        var user = this.users.returnUserByName(userName);
        var group = this.getGroupByPath(path);
        var actualGroup = group.addUser(user);
        if(actualGroup!== null){
            // var listener = {user:user,
            //                 group:actualGroup};
            // user.removeUserEvent.subscribe(listener);
            return true;
        }
        else{
            return false;
        }
    }

     removeUserFromGroup(userName,path){
        // var user = this.users.returnUserByName(userName);
        var group = this.getGroupByPath(path);

         if(!!group && group.removeUser(userName)){
             // user.removeUserEvent.unsubscribe(group);
             return true;
         }
         else{
             return false;
         }
    }

     addGroup(newGroupName,path){
         if(path === undefined){
             this.root = new Group(newGroupName);
             return true;
         }
         var group = this.getGroupByPath(path);

         if (!!group){
             group.addNewGroup(newGroupName);
             return true;
         }
         else{
             return false;
         }
     }

     getGroupByPath(path){
         var arr = path.split(">");
         var group = this.root;
         if (group === null){
             return null;
         }
         if(!group.getGroupName() === arr[0]){
             return null;
         }
         for (var i=1; i<arr.length ; i++){
             var children = group.getChildren();
             for(var j=0; j<children.length; j++){
                 if(children[j].getGroupName() === arr[i]){
                     group = children[j];
                     break;
                 }
             }
             // return false;
         }
         if(!!group){
             return group;
         }
         return null;
     }

     deleteTree(){
         this.root = null;
     }

     removeGroup(groupName,path){
         var group = this.getGroupByPath(path);
         var parent = group.getParent();
         if(parent === null){
             this.deleteTree();
         }
         else{
             parent.removeGroup(groupName)
         }
     }

     searchGroup(groupName, currentGroup, groups){
         var foundGroupsArr = groups || [];
         if(this.root === null){
             return foundGroupsArr;
         }
         var group = currentGroup;
         if(group === undefined){
             group = this.root;
         }
         if(group.getGroupName() === groupName){
             foundGroupsArr.push(this.showGroupPath(group))
         }
         if((!group.hasChildren()) || (group.getChildren()[0] instanceof User)){
             return foundGroupsArr;
         }
         var children = group.getChildren();
         for(var i=0 ; i<children.length; i++){
             this.searchGroup(groupName, children[i],foundGroupsArr);
         }
         return foundGroupsArr;
     }

     allGroupsNames(currentGroup,currentAllGroups){
         var allGroups = currentAllGroups || [];
         var group = currentGroup;
         if(group === undefined){
             group = this.root;
         }
         allGroups.push(group.getGroupName());
         var children = group.getChildren();
         if(!group.hasChildren() || children[0] instanceof User){
             return allGroups;
         }
         for (var i=0 ; i< children.length ; i++){
             this.allGroupsNames(children[i],allGroups)
         }
         return allGroups;

     }

     searchUser(userName, currentGroup, users){
         var myUsers = users || [];
         var group = currentGroup || this.root;

         if(!group.hasChildren()){
             return myUsers;
         }
         var children = group.getChildren();
         if(children[0] instanceof  User){
             for(var i=0 ; children.length; i++){
                 if(children[i].getUserName() === userName) {
                     myUsers.push(children[i]);
                 }
             }
             return myUsers;
         }
         else{
                 for(var i=0 ; children.length; i++){
                      search(userName, children[i],myUsers);
                 }
                 return myUsers;
             }

     }

     returnUserByName(userName){
         return this.users.returnUserByName(userName);
     }

     returnGroupByName(groupName){
         return this.searchGroup(groupName);
     }

    // userExistsInGroup(userName,groupName){
    //      var group = this.searchGroup(groupName);
    //      return group.userInGroup(userName);
    // }
    //
    //  groupExistsInGroup(searchedGroupName,groupName){
    //      var group = this.searchGroup(groupName);
    //      return group.userInGroup(userName);
    //  }

     getUsers(){
         return this.users;
     }

     getUsersName(){
         return this.users.allUsersNames()
     }

     setUserAge(userName, newAge){
         return this.users.returnUserByName(userName).setAge(newAge)
     }

     setUserPassword(userName, newPassword){
         return this.users.returnUserByName(userName).setPassword(newPassword)
     }

     returnGroupsAndUsers(group, arr, level){
         var myGroup = group;
         var myLevel = level;
         var arr = arr || [];
         if(myGroup === undefined){
             myGroup = this.root;
             myLevel = 0;
         }
         if(myGroup === null){
             return arr;
         }
         if(!myGroup.hasChildren()){
             arr.push({level:myLevel,
                 name:myGroup.getGroupName(),
                 type:"Group",
                 count:myGroup.getUserCount()});
             return arr;
         }
         arr.push({level:myLevel,
             name:myGroup.getGroupName(),
             type:"Group",
             count:myGroup.getUserCount()});
         var children = myGroup.getChildren();
         if(children[0] instanceof User){
             for(var i=0 ; i<children.length; i++){
                 arr.push({
                     level:myLevel + 1,
                     name:children[i].getUserName(),
                     type:"User"
                 });
             }
            return arr;
         }
         for(var i=0 ; i<children.length; i++){
             this.returnGroupsAndUsers(children[i],arr,myLevel+1);
         }
         return arr;
     }

     showGroupPath(group){
         var path = group.getGroupName();
         while(group.getParent()){
            path = group.getParent().getGroupName() + ">" + path;
             group = group.getParent();
         }
         return path;
     }

     // showGroupPath(groupName, arr, currentGroup){
     //     var arr = arr || [];
     //     if(this.root === null){
     //         return arr;
     //     }
     //     var group = currentGroup;
     //     if(group === undefined){
     //         group = this.root;
     //     }
     //     arr.push(group.getGroupName());
     //     if(group.getGroupName() === groupName){
     //         // arr.push(groupName)
     //         return arr;
     //     }
     //     if((!group.hasChildren()) || (group.getChildren()[0] instanceof User)){
     //         arr.pop();
     //         return arr;
     //     }
     //     var children = group.getChildren();
     //     var oldLength = arr.length;
     //     for(var i=0 ; i<children.length; i++){
     //         if(children[i].getGroupName() === groupName){
     //             arr.push(groupName);
     //             return arr;
     //         }
     //         this.showGroupPath(groupName,arr, children[i]);
     //         if(oldLength===arr.length ){
     //             arr.pop();
     //         }
     //     }
     //     // arr.pop();
     //     return arr;
     // }

     getGroupsOfUser(userName){
        var user = this.returnUserByName(userName);
        var handlers = user.getHandlers()

         return handlers.map(function (handler) {
             if (!!handler) {
                 return handler.group.getGroupName();
             }
         });
     }

     flatGroup(path){
         var group = this.getGroupByPath(path);
         if(group.flat()){
            return true;
         }
         return false;
     }
 }


module.exports.Chat = Chat;