var Resource = function (infos) {
    this.name = infos.name;
    this.idField = infos.idField;
    this.repository = new infos.repositoryClass(infos.repositoryOptions);
};

Resource.prototype.getUri = function() {
    return "/" + this.name;
};

module.exports = Resource;