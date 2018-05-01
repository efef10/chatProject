const {User}    = require('./User.js');
const Users    = require('./Users.js').Users;

function Group(groupName, groupUsers){
    this.groupName  = groupName;
    this.groupUsers = groupUsers || [];
}

Group.prototype = {
    addUser:function(user){
        this.groupUsers.push(user);
    },

    removeUser:function(userName){
        this.groupUsers.splice(this.indexOfUserInGroup(userName),1);
    },

    getUsers:function(){
        return this.groupUsers;
    },

    getGroupName:function(){
        return this.groupName;
    },

    indexOfUserInGroup:function(userName){
        var users = this.groupUsers;
        for(var i=0 ; i< users.length; i++){
            if(users[i].getUserName() === userName){
                return i;
            }
        }
        return -1;
    }
};

module.exports.Group = Group;