const {User}    = require('./User.js');

class Group{

    constructor(groupName, children, parent) {
        this.groupName  = groupName;
        this.children   = children || [];
        this.parent = parent || null;
    }

    //----------GET-SET:------------
    //------------------------------
    getGroupName(){
        return this.groupName;
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

    setParent(parent){
        this.parent = parent;
    }
    //------------------------------
    //------------------------------


    //-------ADD/REMOVE FROM GROUP:-------
    //------------------------------------
    addUser(user){
        if((!this.hasChildren()) || (this.children[0] instanceof User)) {
            this.children.push(user);
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
            return this;
        }
    }

    removeUser(userName){
        if(this.hasChildren() && (this.children[0] instanceof User)){
            this.children.forEach(function(child, i){
                if (child.getUserName() === userName){
                    this.children.splice(i,1);
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

    removeGroup(groupName){
        if(!this.hasChildren() || (this.children[0] instanceof User)){
            return false;
        }
        for(var i=0 ; i<this.children.length ; i++){
            if(this.children[i].getGroupName() === groupName){
                this.children.splice(i,1);
                return true;
            }
        }
        return false;
    }
    //------------------------------------
    //------------------------------------


    //---BOOLEAN HELP FUNCTIONS:-------
    //---------------------------------
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
    //---------------------------------
    //---------------------------------


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