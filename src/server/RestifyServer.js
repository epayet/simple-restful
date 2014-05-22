var BaseServer = require("./BaseServer");
var restify = require("restify");

var Server = function () {
    BaseServer.call(this);
    this.server = restify.createServer();
};

Server.prototype = Object.create(BaseServer.prototype);

Server.prototype.listen = function(port, callback) {
    var self = this;
    this.server.listen(port, function() {
        self.url = self.server.url;
        self.isRunning = true;
        callback();
    });
};

Server.prototype.close = function() {
    this.server.close();
    this.isRunning = false;
};

module.exports = Server;