class User{
    constructor(userName, age, password){
        this.userName = userName;
        this.age = age;
        this.password = password;
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
}

module.exports.User = User;