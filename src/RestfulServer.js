var serverFactory = require("./server/serverFactory");
var Resource = require("./Resource");

var RestfulServer = function (options) {
    this.resources = [];
    this.repositoryClasses = {};
    if(options) {
        this.port = options.port ? options.port : 8080;
        this.debug = options.debug ? options.debug : true;
        this.server = serverFactory.create();
    }
};

RestfulServer.prototype.addResource = function(resourceInfo) {
    resourceInfo.repositoryClass = this.repositoryClasses[resourceInfo.repository];
    this.resources.push(new Resource(resourceInfo));
};

RestfulServer.prototype.registerRepository = function(repositoryName, repository) {
    this.repositoryClasses[repositoryName] = repository;
};

RestfulServer.prototype.registerRepositories = function(repositories) {
    for(var name in repositories)
        this.repositoryClasses[name] = repositories[name];
};

RestfulServer.prototype.close = function() {
    if(this.server.isRunning)
        this.server.close();
};

RestfulServer.prototype.run = function() {
    this.createRoutes();
    var self = this;
    this.server.listen(this.port, function() {
        if(self.debug) {
            console.log('server listening at %s', self.server.url);
        }
    });
};

RestfulServer.prototype.createRoutes = function() {
    for(var i=0; i<this.resources.length; i++) {
        this.createRoutesForResource(this.resources[i]);
    }
};

RestfulServer.prototype.createRoutesForResource = function(resource) {
    //TODO use complex object
    /*this.server.addRoute("GET", resource.getUri(), resource.repository.get);
    this.server.addRoute("GET", resource.getUriWithIdField(), resource.repository.getAll);
    this.server.addRoute("POST", resource.getUri(), resource.repository.add);
    this.server.addRoute("PUT", resource.getUriWithIdField(), resource.repository.update);
    this.server.addRoute("DELETE", resource.getUriWithIdField(), resource.repository.delete);*/
};

module.exports = RestfulServer;