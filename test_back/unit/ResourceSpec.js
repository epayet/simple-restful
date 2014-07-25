var Resource = require("../../src/resource/Resource");
var ResourceWithParent = require("../../src/resource/ResourceWithParent");
var BaseController = require("../../src/controller/BaseController");

var controller = new BaseController();

var simpleResourceInfo = getTestData("simpleResource");
var subResourceInfo = getTestData("subResource");

var simpleResource, subResource;

describe("Resource", function () {

    beforeEach(function () {
        simpleResource = new Resource(simpleResourceInfo);
        subResource = new ResourceWithParent(subResourceInfo, simpleResource);
    });

    describe("initialization", function () {
        it("should be defined", function () {
            expect(simpleResource).toBeDefined();
            expect(subResource).toBeDefined();
        });

        it("should have correct values", function () {
            expect(simpleResource.controller).toBe(controller);
        });
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
});

function getTestData(data) {
    switch(data) {
        case "simpleResource":
            return {
                name: "example",
                idField: "name",
                controller: controller
            };
        case "subResource":
            return {
                name: "sub",
                idField: "subId",
                controller: controller
            }
    }
}