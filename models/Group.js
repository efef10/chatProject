const {User}    = require('./User.js');
const Users    = require('./Users.js').Users;

function Group(groupName, children){
    this.groupName  = groupName;
    this.groups     = [];
    this.children   = children || [];
}

Group.prototype = {
    addUser:function(userName, age, password){
        if((!this.hasChildren()) || (this.children[0] instanceof User)) {
            this.children.push(new User(userName, age, password));
        }
        else{
            this.children.push(new Group("newGroup", new User(userName, age, password)))
        }
    },

    addGroup : function(groupName){
        if(this.hasChildren() && (this.children[0] instanceof User)){
            var tmpGroup = new Group(groupName + "NewGroup",this.children)
            this.children = [];
            this.children.push(tmpGroup);
        }
        //anyway, insert a new group:
        this.children.push(new Group(groupName));
    },

    removeUser:function(userName){
        if(this.hasChildren() && (this.children[0] instanceof User)){
            this.children.forEach(function(child, i){
               if (child.getUserName() === userName){
                   this.children.splice(i,1);
                   return true;
               }
            });
            return false;
        }
        else{
            this.children.forEach(function(child){
                if(child.removeUser(userName)){
                    return true;
                }
            });
            return false;
        }
    },


    getChildren:function(){
        return this.children;
    },

    getGroupName:function(){
        return this.groupName;
    },

    // part1:
    indexOfUserInGroup:function(userName){
        var users = this.groupUsers;
        for(var i=0 ; i< users.length; i++){
            if(users[i].getUserName() === userName){
                return i;
            }
        }
        return -1;
    },


    userInGroup:function(userName){
        if (!this.hasChildren()){
            return false;
        }
        if (!this.hasChildren())
        var users = this.children;
        for(var i=0 ; i< users.length; i++){
            if(users[i].getUserName() === userName){
                return i;
            }
        }
        return -1;
    },

    hasChildren:function(){
        return this.children.length !== 0;
    }
};

module.exports.Group = Group;