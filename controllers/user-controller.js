const Menu = require('../views/menu.js');

class UserController {
    constructor(chat,backToMain) {
        this.chat = chat;
        this.backToMain = backToMain;
    }

    menu(){
        Menu.ask("*********************************************  \n" +
                 "[n] new user \n" +
                 "[r] remove user \n" +
                 "[v] view all users \n" +
                 "[a] update user age \n" +
                 "[p] update user password \n" +
                 "[m] back to main menu \n",(input)=>{
            switch (input) {
                case "n": // new user
                    this.createUser();
                    break;

                case "r": // remove user
                    this.removeUser();
                    break;

                case "v": // view all users
                    Menu.log(this.chat.allUsersNames());
                    this.backToMain();
                    break;

                case "a": // update user age
                    this.updateAge();
                    break;

                case "p": // update user password
                    this.updatePassword();
                    break;

                case "m": // back to menu
                    this.backToMain();
                    break;

                default: {
                    Menu.log("please choose a letter from the menu");
                    this.menu();
                }
            }
        });
    }

    createUser() {
        Menu.ask("what is your username? \n",(userName) => {
            var myUserName = userName;
            var myAge;
            if (this.userNameExists(userName)) {
                Menu.log(`user ${userName} already exists`);
                this.menu();
                return;
            }
            else {
                getUserAge.call(this);
            }

            function getUserAge() {
                // console.log('user age this', this);
                Menu.ask("what is your age? \n",(age) => {
                    if (isNaN(age)) {
                        Menu.log(`please enter numeric value`)
                        getUserAge.call(this);
                    }
                    else {
                        myAge = age;
                        getUserPassword.call(this);
                    }
                });
            }

            function getUserPassword() {
                Menu.ask("enter password? \n",(password) => {
                    this.chat.addUser(myUserName, myAge, password);
                    Menu.log(`user ${userName} added successfully`);
                    this.backToMain();
                });
            }
        });
    }

    removeUser(){
        Menu.ask("choose username \n",(userName) => {
            if (!this.userNameExists(userName)) {
                Menu.log(`user ${userName} not exists`)
                this.menu();
                return;
            }
            else {
                this.chat.removeUser(userName);
                Menu.log(`user ${userName} removed successfully`);
                this.backToMain();
                return;
            }
        });
    }

    updateAge(){
        Menu.ask("enter user name \n",(userName)=>{
            if(!this.userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                this.menu();
                return;
            }
            else{
                getNewAge.call(this);
            }

            function getNewAge(){
                Menu.ask("enter new age \n",(age)=>{
                    if (isNaN(age)) {
                        Menu.log(`please enter numeric value`);
                        getNewAge.call(this);
                    }
                    else {
                        this.chat.setUserAge(userName, age);
                        Menu.log(`user's age was updated successfully`);
                        this.backToMain();
                    }
                });
            }
        });
    }

    updatePassword(){
        Menu.ask("enter user name \n",(userName)=>{
            var user;
            if(!this.userNameExists(userName)){
                Menu.log(`user ${userName} not exists`);
                this.menu();
                return;
            }
            else{
                user = this.chat.returnUserByName(userName);
                getOldPassword.call(this,3);
            }

            function getOldPassword(tries){
                Menu.ask("enter old password \n",(password)=>{
                    if (user.getPassword()===password) {
                        getNewPassword.call(this);
                    }
                    else {
                        if(tries === 0){
                            Menu.log(`error, change password failed due to too much wrong tries`);
                            this.menu();
                            return;
                        }else{
                            Menu.log(`entered password does not match old password, you have ${tries} tries left`);
                            getOldPassword.call(this,tries-1);
                        }
                    }
                });
            }

            function getNewPassword(){
                Menu.ask("enter new password \n",(password)=>{
                    this.chat.setUserPassword(user.getUserName(),password);
                    Menu.log(`user's password was updated successfully`);
                    this.backToMain();
                });
            }
        });
    }

    userNameExists(userName) {
        if (this.chat.returnUserByName(userName)) {
            return true;
        }
        return false;
    }
}

module.exports.UsersController = UserController;