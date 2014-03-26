var Restify = require("restify");

var RestServer = function(options) {
    this.port = options.port;
    this.debug = options.debug;

    this.server = Restify.createServer();
    this.server.use(Restify.queryParser());
    this._mapJsonBody();
    this._acceptXHR();
};

RestServer.prototype.run = function() {
    var server = this.server;
    var self = this;
    this.server.listen(this.port, function() {
        if(self.debug)
            console.log('%s listening at %s', server.name, server.url);
    });
};

RestServer.prototype.close = function() {
    this.server.close();
};

RestServer.prototype.get = function(uri, callback) {
    this.server.get(uri, callback);
};

RestServer.prototype.post = function(uri, callback) {
    this.server.post(uri, callback);
};

RestServer.prototype.del = function(uri, callback) {
    this.server.del(uri, callback);
};

//private functions
RestServer.prototype._mapJsonBody = function() {
    this.server.use(Restify.bodyParser({ mapParams: false }));
};

RestServer.prototype._acceptXHR = function () {
    this.server.use(
        function crossOrigin(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
        }
    );
};

module.exports = RestServer;