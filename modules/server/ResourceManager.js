var Resource = require("./Resource");

var ResourceManager = function() {
    this.resources = [];
}

ResourceManager.prototype.addResource = function(resourceInfo) {
    var resource = new Resource(resourceInfo);
    this.resources.push(resource);
}

ResourceManager.prototype.addToServer = function (server) {
    this._prepareResources(this.resources);
    for(var i=0; i<this.resources.length; i++) {
        this.resources[i].addRoutes(server);
    }
}

ResourceManager.prototype._prepareResources = function(resources) {
    for(var i=0; i<resources.length; i++) {
        var linkedResourcesInfo = resources[i].linkedResourcesInfo;
        if(linkedResourcesInfo != null) {
            for(var j=0; j<linkedResourcesInfo.length; j++) {
                var linkedResource = this._getResource(linkedResourcesInfo[j].name);
                resources[i].addLinkedResource(linkedResource);
            }
        }
        if(resources[i].hasSubResources())
            this._prepareResources(resources[i].subResources);
    }
};

ResourceManager.prototype._getResource = function(resourceName, resources) {
    if(resources == null)
        resources = this.resources;

    for(var i=0; i<resources.length; i++) {
        if(resources[i].name == resourceName)
            return resources[i];
        if(resources[i].hasSubResources()) {
            var subResource = this._getResource(resourceName, resources[i].subResources);
            if(subResource != null)
                return subResource;
        }
    }
    return null;
};

module.exports = ResourceManager;