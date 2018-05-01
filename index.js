// const {ChatController} = require('./controllers/chat-controller.js');
const  ChatController = require('./controllers/test-controller.js').ChatController;

new ChatController().init();
