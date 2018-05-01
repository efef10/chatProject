const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function RootMenu(callback){
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
        "[q] quit \n",callback);
}

function ask(question,callback) {
    rl.question(question, callback);
}

function log(message){
    console.log(message);
}

function quit(){
    rl.close();
}

module.exports = {
    RootMenu,
    ask,
    log,
    quit
}