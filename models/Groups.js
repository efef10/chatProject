//cancelled Class for now

const {Group}   = require('./Group.js');

class Groups{
    constructor(groupName){
        this.root = new Group(groupName);
    }

    addGroup (groupName){
        this.groups.push(new Group(groupName));
    }

    removeGroup (groupName){
        var group = this.returnGroupByName(groupName);
    }
    allGroupsNames(){
        return this.groups.map(function (group) {
            if (!!group) {
                return group.groupName;
            }
        });
    }
    allGroups(){
        return this.groups.map(function (group) {
            if (!!group) {
                return group;
            }
        });
    }
    returnGroupByName(groupName){
        if(!!groupName){
            for(var i=0; i<this.groups.length ; i++){
                if(this.groups[i].groupName === groupName){
                    return this.groups[i];
                }
            }
            return null; //throw "group with such a name was not found"
        }
        return null;
    }
    isEmpty(){
        return this.groups.length === 0;
    }
}




module.exports.Groups = Groups;