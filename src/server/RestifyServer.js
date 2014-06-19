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

Server.prototype.get = function(uri, callback) {
    this.server.get(uri, callback);
};

Server.prototype.post = function(uri, callback) {
    this.server.post(uri, callback);
};

Server.prototype.put = function(uri, callback) {
    this.server.put(uri, callback);
};

Server.prototype.del = function(uri, callback) {
    this.server.del(uri, callback);
};

Server.prototype.mapJsonBody = function() {
    this.server.use(restify.bodyParser({ mapParams: false }));
};

Server.prototype.queryParser = function() {
    this.server.use(restify.queryParser());
};

module.exports = Server;