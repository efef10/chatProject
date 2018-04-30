function Group(groupName, groupUsers){
    this.groupName  = groupName;
    this.groupUsers = groupUsers || [];
}

Group.prototype = {
    addUser:function(user){
        this.groupUsers.push(user);
    },
    removeUser:function(user){
        this.groupUsers.splice(this.groupUsers.indexOf(user),1);
    }
    ,getUsers:function(){
        return this.groupUsers;
    }
    ,getGroupName:function(){
        return this.groupName;
    }
    ,userInGroup:function(userName){
        var users = this.groupUsers;
        for(var i=0 ; i< users.length; i++){
            if(users[i].getUserName() === userName){
                return true;
            }
        }
        return false;
    }
};

module.exports.Group = Group;