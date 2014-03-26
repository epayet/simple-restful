var util = require('../util');

var Resource = function(resourceInfo) {
    this.subResources = [];
    this.linkedResources = {};
    this.linkedResourcesInfo = resourceInfo.linkedResources;
    this.idField = resourceInfo.idField;
    this.name = resourceInfo.name;
    this.authorizeDeleteAll = resourceInfo.authorizeDeleteAll;

    this._createRepository(resourceInfo.repositoryInfo);
    this._createSubResources(resourceInfo.subResources);
};

Resource.prototype.addRoutes = function(server) {
    var resourceUri = this._getResourceUri();
    var resourceUriWithIdField = this._getResourceUriWithIdField();
    var self = this;

    //additionalIdentifiers is the merge with req.params and req.query, careful : may overwrite one or the other
    server.get(resourceUriWithIdField, function(req, res) {
        if(server.debug)
            console.log("GET %s", req.url);

        var additionalIdentifiers = util.mergeObjects(req.params, req.query);
        self.repository.get(req.params[self.idField], function(resource) {
            if(resource != null)
                res.send(resource);
            else
                res.send(204);
        }, additionalIdentifiers);
    });

    server.get(resourceUri, function(req, res) {
        if(server.debug)
            console.log("GET %s", req.url);

        var additionalIdentifiers = util.mergeObjects(req.params, req.query);
        self.repository.getAll(function(resources) {
            if(resources != null)
                res.send(resources);
            else
                res.send(204);
        }, additionalIdentifiers);
    });

    server.post(resourceUri, function(req, res) {
        if(server.debug)
            console.log("POST %s", req.url);

        var additionalIdentifiers = util.mergeObjects(req.params, req.query);
        self.repository.add(req.body, function(resource) {
            res.send(resource);
        }, additionalIdentifiers);
    });

    server.post(resourceUriWithIdField, function(req, res) {
        if(server.debug)
            console.log("POST %s", req.url);

        var additionalIdentifiers = util.mergeObjects(req.params, req.query);
        self.repository.update(req.body, function(resource) {
            res.send(resource);
        }, additionalIdentifiers);
    });

    server.del(resourceUriWithIdField, function(req, res) {
        if(server.debug)
            console.log("DELETE %s", req.url);

        var additionalIdentifiers = util.mergeObjects(req.params, req.query);
        self.repository.remove(req.params[self.idField], function() {
            res.send(204);
        }, additionalIdentifiers);
    });

    if(this.authorizeDeleteAll) {
        server.del(resourceUri, function(req, res) {
            if(server.debug)
                console.log("DELETE %s", req.url);

            var additionalIdentifiers = util.mergeObjects(req.params, req.query);
            self.repository.removeAll(function() {
                res.send(204);
            }, additionalIdentifiers);
        });
    }

    for(var i=0; i<this.subResources.length; i++) {
        this.subResources[i].addRoutes(server);
    }
};

Resource.prototype.addLinkedResource = function(linkedResource) {
    this.linkedResources[linkedResource.name] = linkedResource;
    this.repository.addLinkedRepository(linkedResource.name, linkedResource.repository);
};

//private functions
Resource.prototype._hasParent = function() {
    return this.parent != null;
};

Resource.prototype.hasSubResources = function() {
    return this.subResources.length > 0;
};

Resource.prototype._createSubResources = function (subResourcesInfo) {
    if(subResourcesInfo != null) {
        for (var i = 0; i < subResourcesInfo.length; i++) {
            var subResource = new Resource(subResourcesInfo[i]);
            this._addSubResource(subResource);
        }
    }
};

Resource.prototype._addSubResource = function(subResource) {
    subResource.parent = this;
    this.repository.addSubRepository(subResource.repository);
    this.subResources.push(subResource);
};

Resource.prototype._createRepository = function(repositoryInfo) {
    var Repository = require("../repository/" + repositoryInfo.repositoryType);
    var dataInfo = {
        idField: this.idField,
        name : this.name
    };
    this.repository = new Repository(dataInfo, repositoryInfo);
};

Resource.prototype._getResourceUri = function() {
    var uri = "";
    if(this.parent != null)
        uri = this.parent._getResourceUriWithIdField();

    if(this.name != null)
        uri += "/" + this.name;

    return uri;
};

Resource.prototype._getResourceUriWithIdField = function() {
    var uri = this._getResourceUri();

    if(this.idField != null)
        uri += "/:" + this.idField;

    return uri;
};

module.exports = Resource;