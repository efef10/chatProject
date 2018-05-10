const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function RootMenu(callback){
    rl.question("*********************************************  \n" +
                "choose menu:\n" +
                "[u] users \n" +
                "[g] groups \n" +
                "[a] users & groups \n" +
                "[q] quit \n" ,callback);
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
};