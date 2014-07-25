var resourceFactory = require("../../../src/resource/resourceFactory");
var Resource = require("../../../src/resource/Resource");
var ResourceWithParent = require("../../../src/resource/ResourceWithParent");
var ResourceWithNoIdField = require("../../../src/resource/ResourceWithNoIdField");
var ResourceWithParentAndNoIdField = require("../../../src/resource/ResourceWithParentAndNoIdField");

describe("resourceFactory", function () {
    describe("createResource", function () {
        it("should create a simple resource", function () {
            var resource = resourceFactory.createResource({idField: "id"});
            expect(resource instanceof Resource).toBe(true);
        });

        it("should create a resource with parent", function () {
            var resource = resourceFactory.createResource({idField: "id"}, {});
            expect(resource instanceof ResourceWithParent).toBe(true);
        });

        it("should create a resource with no id field", function () {
            var resource = resourceFactory.createResource({});
            expect(resource instanceof ResourceWithNoIdField).toBe(true);
        });

        it("should create a sub resource with no idField", function () {
            var resource = resourceFactory.createResource({}, {});
            expect(resource instanceof ResourceWithParentAndNoIdField).toBe(true);
        });
    });
});