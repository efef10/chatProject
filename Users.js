function Users(users){

    //private properties
    this.users = users || [];

}

Users.prototype = {
    addUser:function(user){
        this.users.push(user);
    },
    removeUser:function(user){
        var index = this.users.indexOf(user);
        user.removeUserEvent.fire(user.getUserName());
        this.users[index] = null;
        this.users.splice(index,1);
    },returnUserByName: function (userName){
        if(!!userName){
            for(var i=0; i<this.users.length ; i++){
                if(this.users[i].userName === userName){
                    return this.users[i];
                }
            }
            return null;
        }
        return null;
    },
    isEmpty:function(){
        return this.users.length === 0;
    },
    getUsers:function(){
        return this.users;
    },allUsersNames:function(){
        return this.users.map(function (user) {
            if (!!user) {
                return user.userName;
            }
        });
    }
};


module.exports.Users = Users;