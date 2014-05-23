var Resource = require("../src/Resource");
var InMemoryRepository = require("../src/repository/InMemoryRepository");

var simpleResourceInfo = getTestData("simpleResource");

module.exports = {
    simpleGetUri: function(assert) {
        var resource = new Resource(simpleResourceInfo);
        assert.equals(resource.getUri(), "/example");
        assert.done();
    }
};

function getTestData(data) {
    switch(data) {
        case "simpleResource":
            return {
                name: "example",
                idField: "name",
                repositoryClass: InMemoryRepository
            };
    }
}