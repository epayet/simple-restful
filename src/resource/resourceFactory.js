var Resource = require("./Resource");
var ResourceWithParent = require("./ResourceWithParent");
var ResourceWithNoIdField = require("./ResourceWithNoIdField");
var ResourceWithParentAndNoIdField = require("./ResourceWithParentAndNoIdField");

function createResource(resourceInfo, parent) {
    var resource;
    if(parent && resourceInfo.idField)
        resource = new ResourceWithParent(resourceInfo, parent);
    else if(parent)
        resource = new ResourceWithParentAndNoIdField(resourceInfo, parent);
    else if(resourceInfo.idField)
        resource = new Resource(resourceInfo);
    else
        resource = new ResourceWithNoIdField(resourceInfo);
    return resource;
}

exports.createResource = createResource;