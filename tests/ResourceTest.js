var Resource = require("../src/resource/Resource");
var ResourceWithParent = require("../src/resource/ResourceWithParent");
var InMemoryRepository = require("../src/repository/InMemoryRepository");

var simpleResourceInfo = getTestData("simpleResource");
var subResourceInfo = getTestData("subResource");

var simpleResource, subResource;

module.exports = {
    setUp: function(callback) {
        simpleResource = new Resource(simpleResourceInfo);
        subResource = new ResourceWithParent(subResourceInfo, simpleResource);
        callback();
    },

    simple: {
        simpleGetUri: function (assert) {
            assert.equals(simpleResource.getUri(), "/example");
            assert.done();
        },

        getUriWithIdField: function (assert) {
            assert.equals(simpleResource.getUriWithIdField(), "/example/:name");
            assert.done();
        }
    },

    withParent: {
        createResourceWithParent: function(assert) {
            assert.notEqual(subResource.parent, null);
            assert.done();
        },

        getUri: function(assert) {
            assert.equals(subResource.getUri(), "/example/:name/sub");
            assert.done();
        },

        getUriWithIdField: function(assert) {
            assert.equals(subResource.getUriWithIdField(), "/example/:name/sub/:subId");
            assert.done();
        }
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
        case "subResource":
            return {
                name: "sub",
                idField: "subId",
                repositoryClass: InMemoryRepository
            }
    }
}