const User     = require('./User.js').User;
const Group    = require('./Group.js').Group;
const Users    = require('./Users.js').Users;
const Groups   = require('./Groups.js').Groups;
const UsersToGroups = require('./UsersToGroups.js').UsersToGroups;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var myGroups;
var myUsers;
var myUsersToGroups;
var addUserQuestions;
var addUserIndex;
var userTmpArr;

init();
main();

function init(){

    myGroups = new Groups();
    myUsers  = new Users();
    myUsersToGroups = new UsersToGroups(myUsers,myGroups);

    //initialize examples:
    myGroups.addGroup(new Group("js"));
    myUsers.addUser(new User("efrat", 25, "1234"));
    myUsers.addUser(new User("gal", 27, "pass123"));

}

function createUserMessage(){
    var CreateUserName,
        CreateUserAge;
    rl.question("what is your username? \n",createUserAge);

    function createUserAge(userName){
        if(myUsers.returnUserByName(userName)){
            console.log(`username ${userName} already exists`);
            createUserMessage();
            return;
        }
        CreateUserName = userName;
        rl.question("what is your age? \n",createUserPassword);
    }

    function createUserPassword(age){
        if(isNaN(age)){
            console.log("please enter numeric value \n");
            createUserAge(CreateUserName);
        }
        CreateUserAge = age;
        rl.question("enter password? \n",(password)=>{
            myUsers.addUser(new User(CreateUserName,CreateUserAge,password));
            console.log(`user ${CreateUserName} was added successfully`)
            main();
            return true;
        });
    }
}

function createGroupMessage(){
    rl.question("enter group name \n" ,(input)=>{
        if(!myGroups.returnGroupByName(input)){
            myGroups.addGroup(new Group(input));
            console.log("group '" + input + "' was added successfully \n");
            main();
        }
        else{
            console.log("group already exists");
            createGroupMessage();
        }
    });
}

function removeUserMessage() {
    if(myUsers.isEmpty()){
        console.log("can't perform action, no users in system");
        main();
        return;
    }
    rl.question("which user do you want to remove? (press [m] for menu \n", (input) => {
        if(input == 'm'){
            main();
            return;
        }
        var user = myUsers.returnUserByName(input);
        if (!!user) {
            myUsers.removeUser(user);
            console.log("user " + input + " removed successfully \n");
            main();
        }
        else {
            console.log("user " + input + " not exists");
            removeUserMessage();
        }
    });
}

function removeGroupMessage() {
    if(myGroups.isEmpty()){
        console.log("can't perform action, no groups in system");
        main();
        return;
    }
    rl.question("which group do you want to remove? (press [m] for menu \n", (input) => {
        if(input == 'm'){
            main();
            return;
        }
        var group = myGroups.returnGroupByName(input);
        if (!!group) {
            myGroups.removeGroup(group);
            console.log("group " + input + " removed successfully \n");
            main();
        }
        else {
            console.log("group " + input + " not exists");
            removeGroupMessage();
        }
    });
}

function addUserToGroupMessage(){
    rl.question("please enter userName \n",addUserToGroup);
}

function addUserToGroup(userName){
    var user = myUsers.returnUserByName(userName);
    if(!!user) {
        rl.question("please enter group name \n", (groupName) => {
            var group = myGroups.returnGroupByName(groupName);
            if(!!group){
                if(!group.userInGroup(userName)){
                    myUsersToGroups.addUserToGroup(user, group);
                    var obj = {fn:myUsersToGroups.removeUserFromGroup,
                        user:user,
                        group:group};
                    user.removeUserEvent.subscribe(obj);
                    console.log("user " + userName + " was added successfully to group "+groupName);
                    main();
                    return true;
                }
                else{
                    console.log("user " + userName + " already exists in group: " + groupName);
                    main();
                    return false;
                }
            }
            else{
                console.log("group " + groupName + " does not exist");
                main();
                return false;
            }

        });
    }else{
        console.log("user " + userName + " not exists");
        main();
        return false;
    }


}

function removeUserFromGroupMessage(){
    rl.question("please enter userName \n",removeUserFromGroup);
}

function removeUserFromGroup(userName){
    var user = myUsers.returnUserByName(userName);
    if(!!user) {
        rl.question("please enter group name \n", (groupName) => {
            var group = myGroups.returnGroupByName(groupName);
            if(!!group){
                if(group.userInGroup(userName)){
                    myUsersToGroups.removeUserFromGroup(user, group);
                    user.removeUserEvent.unsubscribe(group);
                    console.log("user " + userName + " was removed successfully from group "+groupName);
                    main();
                    return true;
                }
                else{
                    console.log("user " + userName + " not exists in group: " + groupName);
                    main();
                    return false;
                }
            }
            else{
                console.log("group " + groupName + " does not exist");
                main();
                return false;
            }

        });
    }
    else{
        console.log("user " + userName + " not exists");
        main();
        return false;
    }


}

function updateAgeMessage(){
    rl.question("please enter userName \n",updateUserAge);
}

function updateUserAge(userName){
    var user = myUsers.returnUserByName(userName)
    if(!!user){
        rl.question("please enter new age \n",(age)=>
        {
            if(isNaN(age)){
                console.log("please enter numeric value");
                updateUserAge(userName);
            }
            else{
                user.setAge(age);
                main();
            }
        });
    }
    else{
        console.log("user not exists");
        updateAgeMessage();
    }
}

function updatePasswordMessage(){
    rl.question("please enter userName \n",checkOldUserPassword);
}

function checkOldUserPassword(userName,tries){
    var tries = tries;
    if(tries === undefined){
        tries = 3;
    }
    var user = myUsers.returnUserByName(userName)
    if(!!user){
        rl.question("please enter old password \n",updateUserPassword);
    }
    else{
        console.log("user not exists");
        updatePasswordMessage();
    }
    function updateUserPassword(oldPassword){
        if(user.getPassword() === oldPassword){
            rl.question("please enter new password \n",(password) =>{
                user.setPassword(password);
                main();
                }
            );
        }
        else{
            if (tries === 0){
                console.log("error, change password failed due to too much wrong tries")
                main();
                return;
            }
            console.log("old password does not match, try again, you have more " + tries + " times to try");
            checkOldUserPassword(userName, tries -1);
        }

    }
}



function decision(input){
    switch(input){
        case "n": // new user
            createUserMessage();
            break;

        case "r": // remove user
            removeUserMessage();
            break;

        case "v": //view users
            console.log(myUsers.allUsersNames());
            main();
            break;

        case "c": // create group
            createGroupMessage();
            break;

        case "d": // delete group
            removeGroupMessage();
            break;

        case "g": // get all groups
            console.log(myGroups.allGroupsNames());
            main();
            break;

        case "l": // get groups and their users
            myUsersToGroups.allGroupsAndUsers();
            main();
            break;

        case "a": // add user to group
            addUserToGroupMessage();
            break;

        case "e": //delete user from group
            removeUserFromGroupMessage();
            break;

        case "u": //update user age
            updateAgeMessage();
            main();
            break;

        case "p": //update password
            updatePasswordMessage();
            main();
            break;

        case "q": // quit
            rl.close();
            break;

        default: {
            console.log("please choose a letter from the menu");
            main();
        }
    }

}

function main(){
    rl.question("hi, what action would you like to perform? \n" +
        "[n] new user \n" +
        "[r] remove user \n" +
        "[v] view all users \n" +
        "[c] create new group \n" +
        "[d] delete group \n" +
        "[g] get a list of all the groups \n" +
        "[l] list of all groups with users \n" +
        "[a] add user to group \n" +
        "[e] delete user from group \n" +
        "[u] update user age \n" +
        "[p] update user password \n" +
        "[q] quit \n",decision);
}