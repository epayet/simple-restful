var Resource = function (infos) {
    this.name = infos.name;
    this.idField = infos.idField;
    this.repository = new infos.repositoryClass(infos.repositoryOptions);
};

module.exports = Resource;