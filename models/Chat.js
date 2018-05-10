const {Users}    = require('../models/Users.js');
const {nAryTree}   = require('../models/nAryTree.js');

 class Chat{

     constructor() {
         // this.root = null;
         this.groups = new nAryTree();
         this.users = new Users();
     }


     //------USERS FUNCTIONS------------
     //---------------------------------
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

     allUsersNames(){
         return this.users.allUsersNames()
     }

     returnUserByName(userName){
         return this.users.returnUserByName(userName);
     }

     setUserAge(userName, newAge){
         return this.users.setUserAge(userName,newAge);
     }

     setUserPassword(userName, newPassword){
         return this.users.setUserPassword(userName, newPassword)
     }
     //---------------------------------
     //---------------------------------


     //------GROUPS FUNCTIONS-----------
     //---------------------------------
     addGroup(newGroupName,path){
         if(path === undefined){
             return this.groups.addInitialGroup(newGroupName);
         }
         var group = this.getGroupByPath(path);
         if (!!group){
             return group.addNewGroup(newGroupName);
         }
         else{
             return false;
         }
     }

     removeGroup(groupName,path){
         var group = this.getGroupByPath(path);
         var parent = group.getParent();
         if(parent === null){
             this.groups.deleteTree();
         }
         else{
             parent.removeGroup(groupName)
         }
     }

     getGroupByPath(path){
         return this.groups.getGroupByPath(path);
     }

     searchGroup(groupName){
         return this.groups.searchGroup(groupName);
     }

     allGroupsNames(){
         return this.groups.allGroupsNames();
     }

     _rootIsNull(){
         return this.groups._rootIsNull();
     }

     flatGroup(path){
         var group = this.getGroupByPath(path);
         if(group.flat()){
             return true;
         }
         return false;
     }
     //---------------------------------
     //---------------------------------


     //------GROUPS & USERS-------------
     //---------------------------------
     addUserToGroup(userName,path){
         var user = this.users.returnUserByName(userName);
         var group = this.getGroupByPath(path);
         if(group.addUser(user) !== null){
             return true;
         }
         else{
             return false;
         }
     }

     removeUserFromGroup(userName,path){
         var group = this.getGroupByPath(path);

         if(!!group && group.removeUser(userName)){
             return true;
         }
         else{
             return false;
         }
     }

     nameOfAllGroupsOfUser(userName){
         return this.allGroupsOfUser(userName).map(function (group) {
             if (!!group) {
                 return group.groupName;
             }
         });
     }

     allGroupsOfUser(userName){
         return this.groups.allGroupsOfUser(userName);
     }

     returnGroupsAndUsers(){
         return this.groups.returnGroupsAndUsers();
     }
     //---------------------------------
     //---------------------------------
 }


module.exports.Chat = Chat;