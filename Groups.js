function Groups(groups){

    //private properties
    this.groups = groups || [];

}

// noinspection JSAnnotator
Groups.prototype = {
    addGroup : function(group){
        if(!!group) {
            this.groups.push(group);
        }
    },
    removeGroup : function(group){
        // var users = group.allUsers();
        // for(var i=0 ; i<users.length; i++){
        //     users[i].removeUserEvent.unsubscribe(group);
        // }
        this.groups.splice(this.groups.indexOf(group),1);
    },
    allGroupsNames:function(){
        return this.groups.map(function (group) {
            if (!!group) {
                return group.groupName;
            }
        });
    },
    allGroups:function(){
        return this.groups.map(function (group) {
            if (!!group) {
                return group;
            }
        });
    },
    returnGroupByName: function (groupName){
        if(!!groupName){
            for(var i=0; i<this.groups.length ; i++){
                if(this.groups[i].groupName === groupName){
                    return this.groups[i];
                }
            }
            return null; //throw "group with such a name was not found"
        }
        return null;
    },
    isEmpty:function(){
    return this.groups.length === 0;
}
};

module.exports.Groups = Groups;