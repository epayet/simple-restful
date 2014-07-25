var Resource = require("../../../src/resource/Resource");
var ResourceWithParent = require("../../../src/resource/ResourceWithParent");
var ResourceWithNoIdField = require("../../../src/resource/ResourceWithNoIdField");
var ResourceWithParentAndNoIdField = require("../../../src/resource/ResourceWithParentAndNoIdField");
var BaseController = require("../../../src/controller/BaseController");

var controller = new BaseController();

var simpleResourceInfo = getTestData("simpleResource");
var subResourceInfo = getTestData("subResource");
var noIdFieldInfo = getTestData("noIdField");
var parentNoIdFieldInfo = getTestData("parentNoIdField");

var simpleResource, subResource, noIdField, parentNoIdField;

describe("Resource", function () {

    beforeEach(function () {
        simpleResource = new Resource(simpleResourceInfo);
        subResource = new ResourceWithParent(subResourceInfo, simpleResource);
        noIdField = new ResourceWithNoIdField(noIdFieldInfo);
        parentNoIdField = new ResourceWithParentAndNoIdField(parentNoIdFieldInfo, simpleResource);
    });

    describe("initialization", function () {
        it("should be defined", function () {
            expect(simpleResource).toBeDefined();
            expect(subResource).toBeDefined();
            expect(noIdField).toBeDefined();
            expect(parentNoIdField).toBeDefined();
        });

        it("should have correct simple values", function () {
            expect(simpleResource.controller).toBe(controller);
        });

        it("should create a resource with parent", function () {
            expect(subResource.parent).toBeDefined();
        });
    });

    describe("getUri", function () {
        it("should be simple", function () {
            expect(simpleResource.getUri()).toBe("/example");
        });

        it("should be with parent", function () {
            expect(subResource.getUri()).toBe("/example/:name/sub");
        });

        it("should be with no idField like simple", function () {
            expect(noIdField.getUri()).toBe("/noIdField");
        });

        it("should be with no id field and with parent", function () {
            expect(parentNoIdField.getUri()).toBe("/example/:name/noIdField");
        });
    });

    describe("getUriWithIdField", function () {
        it("should be simple", function () {
            expect(simpleResource.getUriWithIdField()).toBe("/example/:name");
        });

        it("should be with parent", function () {
            expect(subResource.getUriWithIdField()).toBe("/example/:name/sub/:subId");
        });
    });

    describe("getRoutes", function () {
        it("should have the simple routes", function () {
            var routes = simpleResource.getRoutes();
            expect(routes.length).toBe(5);
            expect(routes[0]).toEqual({
                verb: "GET",
                uri: "/example",
                resource: simpleResource,
                controllerMethod: "getAll"
            });
        });

        it("should have only 2 routes", function () {
            var routes = noIdField.getRoutes();
            expect(routes.length).toBe(2);
        });

        it("should have only 2 routes with parent uri", function () {
            var routes = parentNoIdField.getRoutes();
            expect(routes.length).toBe(2);
            expect(routes[0]).toEqual({
                verb: "GET",
                uri: "/example/:name/noIdField",
                resource: parentNoIdField,
                controllerMethod: "get"
            });
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
            };
        case "noIdField":
            return {
                name: "noIdField",
                controller: controller
            };
        case "parentNoIdField":
            return {
                name: "noIdField",
                controller: controller
            };
    }
}