var Resource = function (infos) {
    this.name = infos.name;
    this.idField = infos.idField;
    this.controller = infos.controller;
};

Resource.prototype.getUri = function() {
    return "/" + this.name;
};

Resource.prototype.getUriWithIdField = function() {
    return this.getUri() + "/:" + this.idField;
};

Resource.prototype.getRoutes = function() {
    return [
        {
            verb: "GET",
            uri: this.getUri(),
            resource: this,
            controllerMethod: "getAll"
        }, {
            verb: "GET",
            uri: this.getUriWithIdField(),
            resource: this,
            controllerMethod: "get",
            parameterType: "id"
        }, {
            verb: "POST",
            uri: this.getUri(),
            resource: this,
            controllerMethod: "add",
            parameterType: "body"
        }, {
            verb: "PUT",
            uri: this.getUriWithIdField(),
            resource: this,
            controllerMethod: "update",
            parameterType: "body"
        }, {
            verb: "DELETE",
            uri: this.getUriWithIdField(),
            resource: this,
            controllerMethod: "remove",
            parameterType: "id"
        }
    ];
};

module.exports = Resource;