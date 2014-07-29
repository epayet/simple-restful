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

RestfulServer.prototype.addResource = function(resource, parent) {
    var resourceInfo;
    if(resource.info)
        resourceInfo = resource.info;
    else
        resourceInfo = resource;
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

RestfulServer.prototype.createRoute = function(route) {
    switch(route.verb) {
        case "GET":
            this.server.get(route.uri, execute);
            break;
        case "POST":
            this.server.post(route.uri, execute);
            break;
        case "PUT":
            this.server.put(route.uri, execute);
            break;
        case "DELETE":
            this.server.del(route.uri, execute);
            break;
    }

    function execute(req, res) {
        if (route.debug)
            console.log("%s %s", route.verb, req.url);

        //additionalIdentifiers is the merge with req.params and req.query, careful : may overwrite one or the other
        var additionalIdentifiers = _.extend(req.params, req.query);
        var id = req.params[route.resource.idField];
        var controller = route.resource.controller;

        if(controller[route.controllerMethod]) {
            switch (route.parameterType) {
                default:
                    controller[route.controllerMethod](repositoryCallback, additionalIdentifiers);
                    break;
                case "id":
                    controller[route.controllerMethod](id, repositoryCallback, additionalIdentifiers);
                    break;
                case "body":
                    controller[route.controllerMethod](req.body, repositoryCallback, additionalIdentifiers);
                    break;
            }
        } else {
            res.send(404);
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