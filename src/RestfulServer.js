var serverFactory = require("./server/serverFactory");
var Resource = require("./Resource");
var _ = require("underscore");

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
    this.createRoute({
        verb: "GET",
        uri: resource.getUri(),
        repository: resource.repository,
        repositoryMethod: "getAll",
        debug: this.debug
    });

    this.createRoute({
        verb: "GET",
        uri: resource.getUriWithIdField(),
        repository: resource.repository,
        repositoryMethod: "get",
        parameterType: "id",
        debug: this.debug
    });

    this.createRoute({
        verb: "POST",
        uri: resource.getUri(),
        repository: resource.repository,
        repositoryMethod: "add",
        parameterType: "body",
        debug: this.debug
    });

    this.createRoute({
        verb: "PUT",
        uri: resource.getUriWithIdField(),
        repository: resource.repository,
        repositoryMethod: "update",
        parameterType: "body",
        debug: this.debug
    });

    this.createRoute({
        verb: "DELETE",
        uri: resource.getUriWithIdField(),
        repository: resource.repository,
        repositoryMethod: "remove",
        parameterType: "id",
        debug: this.debug
    });

//    this.server.addRoute("GET", resource.getUri(), resource.repository.get);
//    this.server.addRoute("POST", resource.getUri(), resource.repository.add);
//    this.server.addRoute("PUT", resource.getUriWithIdField(), resource.repository.update);
//    this.server.addRoute("DELETE", resource.getUriWithIdField(), resource.repository.delete);
};

RestfulServer.prototype.createRoute = function(infos) {
    switch(infos.verb) {
        case "GET":
            this.server.get(infos.uri, execute);
            break;
        case "POST":
            this.server.post(infos.uri, execute);
            break;
        case "PUT":
            this.server.put(infos.uri, execute);
            break;
        case "DELETE":
            this.server.del(infos.uri, execute);
            break;
    }

    function execute(req, res) {
        if (infos.debug)
            console.log("%s %s", infos.verb, req.url);

        //additionalIdentifiers is the merge with req.params and req.query, careful : may overwrite one or the other
        var additionalIdentifiers = _.extend(req.params, req.query);
        var id = req.params[infos.repository.idField];

        switch(infos.parameterType) {
            default:
                infos.repository[infos.repositoryMethod](repositoryCallback, additionalIdentifiers);
                break;
            case "id":
                infos.repository[infos.repositoryMethod](id, repositoryCallback, additionalIdentifiers);
                break;
            case "body":
                infos.repository[infos.repositoryMethod](req.body, repositoryCallback, additionalIdentifiers);
                break;
        }

        function repositoryCallback(resource) {
            if (resource != null)
                res.send(resource);
            else
                res.send(204);
        }
    }
};

module.exports = RestfulServer;