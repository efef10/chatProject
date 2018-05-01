const {Users}    = require('../models/Users.js');
const {Groups}   = require('../models/Groups.js');

class Chat{
    constructor() {
        // this.start =
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
        var user = this.getUsers().returnUserByName(userName);
        var group = this.getGroups().returnGroupByName(groupName);
        if(!!user && !!group){
            group.addUser(user);
            var obj = {fn:this.removeUserFromGroup,
                       user:user,
                       group:group};
            user.removeUserEvent.subscribe(obj);
            return true;
        }
        else{
            return false;
        }

    }

    removeUserFromGroup(userName,groupName){
        var user = this.getUsers().returnUserByName(userName);
        var group = this.getGroups().returnGroupByName(groupName);
        if(!!user && !!group){
            group.removeUser(user);
            user.removeUserEvent.unsubscribe(group);
            return true;
        }
        else{
            return false;
        }

    }
}

module.exports.Chat = Chat;