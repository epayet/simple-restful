var _ = require("underscore");

var Resource = function (infos) {
    this.name = infos.name;
    this.idField = infos.idField;
    var dataInfo = {
        idField: infos.idField,
        name: infos.name
    };
    this.repository = new infos.repositoryClass(dataInfo, infos.repositoryOptions);
    this.linkedResourcesNames = infos.linkedResourcesNames;
    this.linkedResources = {};
};

Resource.prototype.getUri = function() {
    return "/" + this.name;
};

Resource.prototype.getUriWithIdField = function() {
    return this.getUri() + "/:" + this.idField;
};

Resource.prototype.addLinkedResource = function(linkedResource) {
    this.linkedResources[linkedResource.name] = linkedResource;
};

Resource.prototype.getLinkedResource = function(name) {
    return this.linkedResources[name];
};

module.exports = Resource;