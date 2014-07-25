var Resource = require("./Resource");

var ResourceWithNoIdField = function(infos, parent) {
    Resource.call(this, infos);
    this.parent = parent;
};

ResourceWithNoIdField.prototype = Object.create(Resource.prototype);

ResourceWithNoIdField.prototype.getRoutes = function() {
    return [
        {
            verb: "GET",
            uri: this.getUri(),
            resource: this,
            controllerMethod: "get"
        }, {
            verb: "POST",
            uri: this.getUri(),
            resource: this,
            controllerMethod: "add",
            parameterType: "body"
        }
    ];
};

module.exports = ResourceWithNoIdField;