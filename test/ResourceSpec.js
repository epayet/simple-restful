var Resource = require("../src/resource/Resource");
var ResourceWithParent = require("../src/resource/ResourceWithParent");
var InMemoryRepository = require("../src/repository/InMemoryRepository");

var simpleResourceInfo = getTestData("simpleResource");
var subResourceInfo = getTestData("subResource");

var simpleResource, subResource;

describe("Resource", function () {

    beforeEach(function () {
        simpleResource = new Resource(simpleResourceInfo);
        subResource = new ResourceWithParent(subResourceInfo, simpleResource);
    });

    describe("simple", function () {
        it("should get simple uri", function () {
            expect(simpleResource.getUri()).toBe("/example");
        });

        it("should get an uri with id field", function () {
            expect(simpleResource.getUriWithIdField()).toBe("/example/:name");
        });
    });

    describe("with parent", function () {
        it("should create a resource with parent", function () {
            expect(subResource.parent).toBeDefined();
        });

        it("should get a correct uri", function () {
            expect(subResource.getUri()).toBe("/example/:name/sub");
        });

        it("should get the uri with id field", function () {
            expect(subResource.getUriWithIdField()).toBe("/example/:name/sub/:subId");
        });
    });

    describe("addLinkedResource", function () {
        it("should be accessible", function () {
            simpleResource.addLinkedResource(subResource);
            expect(simpleResource.getLinkedResource("sub").name).toBe("sub");
            expect(simpleResource.repository.linkedRepositories["sub"].dataName).toBe("sub");
        });
    });
});

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