const {User}    = require('./User.js');

class Users{
    constructor(users){
        this.users = users || [];
    }

    addUser(userName, age, password){
        this.users.push(new User(userName, age, password));
    }

    removeUser(userName){
        var user = this.returnUserByName(userName)
        var index = this.users.indexOf(user);
        // user.removeUserEvent.fire(userName);

        this.users.splice(index,1);
    }

    returnUserByName(userName){
        if(!!userName){
            for(var i=0; i<this.users.length ; i++){
                if(this.users[i].userName === userName){
                    return this.users[i];
                }
            }
            return null;
        }
        return null;
    }

    isEmpty(){
        return this.users.length === 0;
    }

    getUsers(){
        return this.users;
    }

    allUsersNames(){
        return this.users.map(function (user) {
            if (!!user) {
                return user.userName;
            }
        });
    }
}


module.exports.Users = Users;