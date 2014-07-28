var Resource = require("./Resource");
var DataController = require("../controller/DataController");

var ResourceWithParent = function(infos, parent) {
    Resource.call(this, infos);
    this.parent = parent;
    if(parent.controller instanceof DataController && this.controller instanceof DataController) {
        parent.controller.repository.addSubRepository(this.controller.repository);
    }
};

ResourceWithParent.prototype = Object.create(Resource.prototype);

ResourceWithParent.prototype.getUri = function () {
    return this.parent.getUriWithIdField() + Resource.prototype.getUri.call(this);
};

module.exports = ResourceWithParent;