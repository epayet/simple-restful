var RestifyServer = require("./RestifyServer");

//default, maybe later with strategy
exports.create = function() {
    var server = new RestifyServer();
    server.mapJsonBody();
    server.acceptXHR();
    server.queryParser();
    return server;
};