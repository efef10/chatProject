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

    setUserAge(userName, newAge){
        return this.returnUserByName(userName).setAge(newAge);
    }

    setUserPassword(userName, newPassword){
        return this.returnUserByName(userName).setPassword(newPassword);
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

    allUsersNames(){
        return this.users.map(function (user) {
            if (!!user) {
                return user.userName;
            }
        });
    }
}


module.exports.Users = Users;