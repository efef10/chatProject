const {Group}   = require('./Group.js');
const {User}    = require('./User.js');

class nAryTree{
    constructor(groupName){
        this.root = null;
        this.treeName = groupName || "nAryTreeGroup";
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

    showGroupPath(group){
        var path = group.getGroupName();
        while(group.getParent()){
            path = group.getParent().getGroupName() + ">" + path;
            group = group.getParent();
        }
        return path;
    }

    returnGroupsAndUsers(){
        var myGroup = this.root;
        var myLevel = 0;
        var arr = [];
        this._returnGroupsAndUsers(myGroup, arr, myLevel);
        return arr;
    }

    _returnGroupsAndUsers(group, arr, level){
        var myGroup = group;
        var myLevel = level;
        var arr = arr || [];
        if(myGroup === null){
            return 0;
        }
        if(!myGroup.hasChildren()){
            arr.push({level:myLevel,
                name :myGroup.getGroupName(),
                type :"Group",
                count:0});
            return 0;
        }
        var children = myGroup.getChildren();
        if(children[0] instanceof User){
            for (var i=children.length-1 ; i>=0; i--){
                arr.push({level:myLevel + 1,
                    name :children[i].getUserName(),
                    type :"User"});
            }
            arr.push({level:myLevel,
                name :myGroup.getGroupName(),
                type :"Group",
                count:children.length});
            return children.length;
        }
        var sum = 0;
        for (var i=children.length -1; i>=0 ; i--){
            sum+=this._returnGroupsAndUsers(children[i],arr,myLevel+1);
        }
        arr.push({level:myLevel,
            name :myGroup.getGroupName(),
            type :"Group",
            count:sum});
        return sum;


        return ;
    }

    _rootIsNull(){
        return this.root === null;
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

    addInitialGroup(groupName){
        if(this._rootIsNull()){
            this.root = new Group(groupName);
            return true;
        }
        return false;
    }
}


module.exports.nAryTree = nAryTree;