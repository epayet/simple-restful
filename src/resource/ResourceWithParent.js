var Resource = require("./Resource");

var ResourceWithParent = function(infos, parent) {
    Resource.call(this, infos);
    this.parent = parent;
    this.parent.repository.addSubRepository(this.repository);
};

ResourceWithParent.prototype = Object.create(Resource.prototype);

ResourceWithParent.prototype.getUri = function () {
    return this.parent.getUriWithIdField() + Resource.prototype.getUri.call(this);
};

module.exports = ResourceWithParent;