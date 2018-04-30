function User(userName, age, password){
    this.userName = userName;
    this.age = age;
    this.password = password;
    this.removeUserEvent = new RemoveUserEvent();  //event observer
}

User.prototype = {
    getAge: function(){
        return this.age;
    },
    setAge : function(age){
        this.age = age;
    },
    getUserName: function () {
        return this.userName;
    },
    getPassword: function() {
        return this.password;
    },
    setPassword: function(password) {
        this.password = password;
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
    fire: function(o, thisObj) {
        var scope = thisObj;
        this.handlers.forEach(function(item) {
            item.fn.call(this,item.user,item.group);
        });
    }

};


module.exports.User = User;