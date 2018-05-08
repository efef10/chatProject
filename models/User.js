function User(userName, age, password){
    this.userName = userName;
    this.age = age;
    this.password = password;
    this.removeUserEvent = new RemoveUserEvent();  //event observer
}

User.prototype = {
    getUserName: function () {
        return this.userName;
    },
    getAge: function(){
        return this.age;
    },
    setAge : function(age){
        this.age = age;
        return true;
    },
    getPassword: function() {
        return this.password;
    },
    setPassword: function(password) {
        this.password = password;
    },
    getHandlers(){
        return this.removeUserEvent.getHandlers();
    }

}

function RemoveUserEvent(){
    this.handlers = [];
}

RemoveUserEvent.prototype = {
    subscribe:function(item){
        this.handlers.push(item);
    },
    unsubscribe:function(group){
        this.handlers = this.handlers.filter(
            function(item) {
                if (item.group !== group) {
                    return item;
                }
            }
        );
    },
    fire: function(userName) {
        this.handlers.forEach(function(item) {
            item.group.removeUser(item.user.getUserName());

            // item.call(this,item.user.getUsersName(),item.group.getGroupName());
        });
    },
    getHandlers(){
        return this.handlers;
    }

};


module.exports.User = User;