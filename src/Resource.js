var _ = require("underscore");

var Resource = function (infos) {
    this.name = infos.name;
    this.idField = infos.idField;
    var repositoryOptions = {
        idField: infos.idField,
        dataName: infos.name
    };
    _.extend(repositoryOptions, infos.repositoryOptions);
    this.repository = new infos.repositoryClass(repositoryOptions);
};

Resource.prototype.getUri = function() {
    return "/" + this.name;
};

Resource.prototype.getUriWithIdField = function() {
    return this.getUri() + "/:" + this.idField;
};

module.exports = Resource;