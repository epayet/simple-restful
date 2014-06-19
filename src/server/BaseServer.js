var Server = function () {
    this.isRunning = false;
};

Server.prototype.listen = function(port, callback) {

};

Server.prototype.close = function() {

};

Server.prototype.get = function(uri, callback) {

};

Server.prototype.post = function(uri, callback) {

};

Server.prototype.put = function(uri, callback) {

};

Server.prototype.del = function(uri, callback) {

};

Server.prototype.mapJsonBody = function() {

};

Server.prototype.queryParser = function() {

};

Server.prototype.acceptXHR = function () {
    this.server.use(
        function crossOrigin(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
        }
    );
};

module.exports = Server;