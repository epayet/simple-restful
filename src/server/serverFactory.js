var RestifyServer = require("./RestifyServer");

//default, maybe later with strategy
exports.create = function() {
    return new RestifyServer();
};