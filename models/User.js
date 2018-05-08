// const {RemoveUserEvent}    = require('./RemoveUserEvent.js');

class User{
    constructor(userName, age, password){
        this.userName = userName;
        this.age = age;
        this.password = password;
        // this.removeUserEvent = new RemoveUserEvent();  //event observer
    }

    getUserName() {
        return this.userName;
    }
    getAge(){
        return this.age;
    }
    setAge(age){
        this.age = age;
        return true;
    }
    getPassword() {
        return this.password;
    }
    setPassword(password) {
        this.password = password;
    }
    // getHandlers(){
    //     return this.removeUserEvent.getHandlers();
    // }
}

module.exports.User = User;