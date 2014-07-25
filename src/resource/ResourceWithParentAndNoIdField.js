var ResourceWithParent = require("./ResourceWithParent");
var ResourceWithNoIdField = require("./ResourceWithNoIdField");

var ResourceWithParentAndNoIdField = function(infos, parent) {
    ResourceWithParent.call(this, infos, parent);
};

ResourceWithParentAndNoIdField.prototype = Object.create(ResourceWithParent.prototype);

ResourceWithParentAndNoIdField.prototype.getRoutes = ResourceWithNoIdField.prototype.getRoutes;

module.exports = ResourceWithParentAndNoIdField;