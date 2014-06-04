var _ = require("underscore");

var Resource = function (infos) {
    this.name = infos.name;
    this.idField = infos.idField;
    var dataInfo = {
        idField: infos.idField,
        dataName: infos.name
    };
    this.repository = new infos.repositoryClass(dataInfo, infos.repositoryOptions);
};

Resource.prototype.getUri = function() {
    return "/" + this.name;
};

Resource.prototype.getUriWithIdField = function() {
    return this.getUri() + "/:" + this.idField;
};

module.exports = Resource;