var Restify = require("restify");
var ResourceManager = require("./ResourceManager");
var InMemoryRepository = require("../repository/InMemoryRepository");
var FileRepository = require("../repository/FileRepository");
var MongoDBRepository = require("../repository/MongoDBRepository");

var RestServer = function(options) {
    this.port = options.port;
    this.debug = options.debug;
    this.resourceManager = new ResourceManager();
    this._initializeDefaultRepositories();

    this.server = Restify.createServer();
    this.server.use(Restify.queryParser());
    this._mapJsonBody();
    this._acceptXHR();
};

RestServer.prototype.addResource = function(resourceInfo) {
    this.resourceManager.addResource(resourceInfo);
};

RestServer.prototype.prepare = function() {
    this.resourceManager.addToServer(this.server);
};

RestServer.prototype.run = function() {
    this.prepare();
    var server = this.server;
    var self = this;
    this.server.listen(this.port, function() {
        if(self.debug)
            console.log('%s listening at %s', server.name, server.url);
    });
};

RestServer.prototype.getRepository = function(repositoryName) {
    return this.repositories[repositoryName];
};

RestServer.prototype.registerRepository = function(repositoryName, repository) {
    this.repositories[repositoryName] = repository;
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
RestServer.prototype._initializeDefaultRepositories = function() {
    this.repositories = {
        "InMemory" : InMemoryRepository,
        "File" : FileRepository,
        "MongoDB" : MongoDBRepository
    };
};

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