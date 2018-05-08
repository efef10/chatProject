const {User}    = require('./User.js');
const Users    = require('./Users.js').Users;

class Group{
    constructor(groupName, children, parent, count) {
        this.groupName  = groupName;
        this.children   = children || [];
        this.parent = parent || null;
        this.usersCount = count || 0;
    }

    addUser(user){
        if((!this.hasChildren()) || (this.children[0] instanceof User)) {
            this.children.push(user);
            this.usersCount++;
            this.rollUpdatedCount('+',1);
            return this;
        }
        else{
            if(this.groupAlreadyInGroup("others")){
                for(var i =0; i<this.children.length ; i++){
                    if(this.children[i].getGroupName()==="others"){
                        if(this.children[i].userInGroup(user.getUserName())){
                            return null;
                        }
                        else{
                            // user.setParent(this.children[i]);
                            this.children[i].addUser(user);
                            return this.children[i];
                        }
                    }
                }
                return null;
            }
            this.children.push(new Group("others", [user], this,1));
            this.usersCount++;
            this.rollUpdatedCount('+',1);
            return this;
        }
    }

    setParent(parent){
        this.parent = parent;
    }

    removeUser(userName){
        if(this.hasChildren() && (this.children[0] instanceof User)){
            this.children.forEach(function(child, i){
                if (child.getUserName() === userName){
                    this.children.splice(i,1);
                    this.usersCount--;
                    this.rollUpdatedCount('-',1);
                    return true;
                }
            }.bind(this));
            return true;
        }
        else{
            return false;
        }
    }

    addNewGroup (groupName){
        if(this.hasChildren() && (this.children[0] instanceof User)){
            var tmpGroup= new Group("others",this.children, this,this.getChildren().length);
            this.children = [];
            this.children.push(tmpGroup);
        }
        //anyway, insert a new group:
        this.children.push(new Group(groupName,[],this));
    }

    addGroup (group){
        var myGroup = group;
        myGroup.setParent(this);
        this.rollUpdatedCount('+',myGroup.getUserCount(), this)
        if(this.hasChildren() && (this.children[0] instanceof User)){
            var tmpGroup= new Group("others",this.children, this,this.getChildren().length);
            this.children = [];
            this.children.push(tmpGroup);
        }
        //anyway, insert a new group:

        this.children.push(myGroup);
    }

    removeGroup(groupName){
        if(!this.hasChildren() || (this.children[0] instanceof User)){
            return false;
        }
        for(var i=0 ; i<this.children.length ; i++){
            if(this.children[i].getGroupName() === groupName){
                this.rollUpdatedCount('-',this.children[i].getUserCount());
                this.children.splice(i,1);
                return true;
            }
        }
        return false;
    }

    getChildren(){
        return this.children;
    }

    setChildren(newChildren){
        this.children = newChildren;
    }

    getParent(){
        return this.parent;
    }

    getGroupName(){
        return this.groupName;
    }

    setUserCount(newCount){
        this.usersCount = newCount;
    }

    getUserCount(){
        return this.usersCount;
    }

    userInGroup(userName){
        var children = this.children;
        if (!this.hasChildren() || children[0] instanceof Group){
            return false;
        }

        for(var i=0 ; i< children.length; i++){
            if(children[i].getUserName() === userName){
                return true;
            }
        }
        return false
    }

    groupAlreadyInGroup(groupName){
        var children = this.children;
        if (!this.hasChildren() || children[0] instanceof User){
            return false;
        }
        for(var i=0 ; i< children.length; i++){
            if(children[i].getGroupName() === groupName){
                return true;
            }
        }
        return false;
    }

    hasChildren(){
        return this.children.length !== 0;
    }

    rollUpdatedCount(sign,count,group){
        var myGroup = group || this;
        while(myGroup.getParent()){
            myGroup = myGroup.getParent();
            if(sign === '+'){
                myGroup.setUserCount(myGroup.getUserCount()+count);
            }
            else{
                myGroup.setUserCount(myGroup.getUserCount()-count);
            }

        }
    }

    flat(){
        if(this.getParent() === null){
            return false;
        }
        if(this.getParent().getChildren().length === 1){
            var children = this.getChildren();
            for (var i=0;i<children.length;i++){
                children[i].setParent(this.getParent());
            }
            this.getParent().setChildren(children);
            return true;
        }
        return false;
    }
}



module.exports.Group = Group;