const {Users}    = require('../models/Users.js');
const {Groups}   = require('../models/Groups.js');

 class Chat{

     constructor() {
         this.myGroups = new Groups();
         this.myUsers = new Users();
     }

     getUsers(){
        return this.myUsers;
    }

     getGroups(){
        return this.myGroups;
    }

     addUserToGroup(userName,groupName){
        var user = this.myUsers.returnUserByName(userName);
        var group = this.myGroups.returnGroupByName(groupName);
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
    }


module.exports.Chat = Chat;