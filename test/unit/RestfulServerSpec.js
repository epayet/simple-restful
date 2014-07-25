var RestfulServer = require("../../src/RestfulServer");
var BaseController = require("../../src/controller/BaseController");

var server;

var controller = new BaseController();

var simpleResourceInfo = getTestData("simpleResource");
var resourceWithSubs = getTestData("resourceWithSubs");
var resourceNoIdField = getTestData("resourceNoIdField");
var resourceWithSubsNoIdField = getTestData("resourceWithSubsNoIdField");

describe("RestfulServer", function () {
    beforeEach(function () {
        server = new RestfulServer({port: 8081, debug:false});
    });

    describe("addResource", function () {
        it("should add a simple resource and register its routes", function () {
            server.addResource(simpleResourceInfo);
            expect(server.resources.length).toBe(1);
            var resource = server.resources[0];
            expect(resource.name).toBe(simpleResourceInfo.name);
            expect(resource.idField).toBe(simpleResourceInfo.idField);
            expect(resource.controller).toBe(controller);
            expect(server.routes).toEqual(resource.getRoutes());
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
        case "resourceWithSubs":
            return {
                name: "parent",
                idField: "id",
                controller: controller,
                subResources: [
                    {
                        name: "sub",
                        idField: "subId",
                        controller: controller
                    }
                ]
            };
        case "resourceWithSubsNoIdField":
            return {
                name: "parent",
                idField: "id",
                controller: controller,
                subResources: [
                    {
                        name: "sub",
                        controller: controller
                    }
                ]
            };
        case "resourceNoIdField":
            return {
                name: "example",
                controller: controller
            };
    }
}