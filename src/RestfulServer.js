var serverFactory = require("./server/serverFactory");
var Resource = require("./resource/Resource");
var ResourceWithParent = require("./resource/ResourceWithParent");
var _ = require("underscore");

var RestfulServer = function (options) {
    this.resources = [];
    this.repositoryClasses = {};
    this.routes = [];
    if(options) {
        this.port = options.port ? options.port : 8080;
        this.debug = options.debug !== undefined ? options.debug : true;
        this.server = serverFactory.create();
    }
};

RestfulServer.prototype.addResource = function(resourceInfo, parent) {
    resourceInfo.repositoryClass = this.repositoryClasses[resourceInfo.repository];
    var resource;
    if(parent)
        resource = new ResourceWithParent(resourceInfo, parent);
    else
        resource = new Resource(resourceInfo);
    this.resources.push(resource);
    this.registerRoutes(resource);
    if(resourceInfo.subResources) {
        for (var i = 0; i < resourceInfo.subResources.length; i++) {
            this.addResource(resourceInfo.subResources[i], resource);
        }
    }
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
    this.setLinkedResources();
    this.createRoutes();
    var self = this;
    this.server.listen(this.port, function() {
        if(self.debug) {
            console.log('server listening at localhost:%s', self.port);
            console.log('Routes available');
            for(var i=0; i<self.routes.length; i++) {
                console.log(self.routes[i].verb + " " + self.routes[i].uri);
            }
        }
    });
};

RestfulServer.prototype.setLinkedResources = function() {
    for(var i=0; i<this.resources.length; i++) {
        if(this.resources[i].linkedResourcesNames) {
            for (var j = 0; j < this.resources[i].linkedResourcesNames.length; j++) {
                var resource = this.getResource(this.resources[i].linkedResourcesNames[j]);
                this.resources[i].addLinkedResource(resource);
            }
        }
    }
};

RestfulServer.prototype.getResource = function(name) {
    return _.find(this.resources, function (resource) {
        return resource.name == name
    });
};

RestfulServer.prototype.createRoutes = function() {
    for(var i=0; i<this.routes.length; i++) {
        this.createRoute(this.routes[i]);
    }
};

RestfulServer.prototype.registerRoutes = function(resource) {
    if(resource.idField) {
        this.routes.push({
            verb: "GET",
            uri: resource.getUri(),
            repository: resource.repository,
            repositoryMethod: "getAll",
            debug: this.debug
        });

        this.routes.push({
            verb: "GET",
            uri: resource.getUriWithIdField(),
            repository: resource.repository,
            repositoryMethod: "get",
            parameterType: "id",
            debug: this.debug
        });

        this.routes.push({
            verb: "POST",
            uri: resource.getUri(),
            repository: resource.repository,
            repositoryMethod: "add",
            parameterType: "body",
            debug: this.debug
        });

        this.routes.push({
            verb: "PUT",
            uri: resource.getUriWithIdField(),
            repository: resource.repository,
            repositoryMethod: "update",
            parameterType: "body",
            debug: this.debug
        });

        this.routes.push({
            verb: "DELETE",
            uri: resource.getUriWithIdField(),
            repository: resource.repository,
            repositoryMethod: "remove",
            parameterType: "id",
            debug: this.debug
        });
    } else {
        //TODO noIdField: means no add method, only update and {} by default
        this.routes.push({
            verb: "GET",
            uri: resource.getUri(),
            repository: resource.repository,
            repositoryMethod: "getAll",
            debug: this.debug
        });

        this.routes.push({
            verb: "POST",
            uri: resource.getUri(),
            repository: resource.repository,
            repositoryMethod: "add",
            parameterType: "body",
            debug: this.debug
        });
    }
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