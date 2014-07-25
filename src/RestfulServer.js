var serverFactory = require("./server/serverFactory");
var resourceFactory = require("./resource/resourceFactory");
var _ = require("underscore");

var RestfulServer = function (options) {
    this.resources = [];
    this.routes = [];
    if(options) {
        this.port = options.port ? options.port : 8080;
        this.debug = options.debug !== undefined ? options.debug : true;
        this.server = serverFactory.create();
    }
};

RestfulServer.prototype.addResource = function(resourceInfo, parent) {
    var resource = resourceFactory.createResource(resourceInfo, parent);
    this.resources.push(resource);
    this.routes = this.routes.concat(resource.getRoutes());
    if(resourceInfo.subResources) {
        for (var i = 0; i < resourceInfo.subResources.length; i++) {
            this.addResource(resourceInfo.subResources[i], resource);
        }
    }
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
            console.log('server listening at localhost:%s', self.port);
            console.log('Routes available');
            for(var i=0; i<self.routes.length; i++) {
                console.log(self.routes[i].verb + " " + self.routes[i].uri);
            }
        }
    });
};

RestfulServer.prototype.createRoutes = function() {
    for(var i=0; i<this.routes.length; i++) {
        this.createRoute(this.routes[i]);
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
        var controller = infos.resource.controller;

        switch(infos.parameterType) {
            default:
                controller[infos.controllerMethod](repositoryCallback, additionalIdentifiers);
                break;
            case "id":
                controller[infos.controllerMethod](id, repositoryCallback, additionalIdentifiers);
                break;
            case "body":
                controller[infos.controllerMethod](req.body, repositoryCallback, additionalIdentifiers);
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