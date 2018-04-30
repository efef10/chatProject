var Users = require('./Users.js').Users;
var Groups = require('./Groups.js').Groups;
var User = require('./User.js').User;
var Group = require('./Group.js').Group;

function UsersToGroups(users,groups){
    this.myUsers = users || [];
    this.myGroups = groups || [];
}

UsersToGroups.prototype = {
    allGroupsAndUsers:function(){
        var groups = this.myGroups.allGroups();
        for (var i=0 ; i<groups.length ; i++){
            console.log("group " + groups[i].groupName + ":");
            var currentGroupUsers = groups[i].getUsers();
            if(!!currentGroupUsers) {
                for (var j = 0; j < currentGroupUsers.length; j++) {
                    console.log(currentGroupUsers[j].getUserName() + ", Age: " + currentGroupUsers[j].getAge());
                }
            }
        }
    }, removeUserFromGroup:function(user,group){
        if(!!user && !!group){
            group.removeUser(user);
            return true;
        }
        else{
            return false;
        }

    }, addUserToGroup: function (user,group){
        if(!!user && !!group){
            group.addUser(user);
            return true;
        }
        else{
            return false;
        }

    }

}

module.exports.UsersToGroups = UsersToGroups;