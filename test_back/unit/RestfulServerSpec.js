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

    describe("resource", function () {
        describe("simple", function () {
            it("should add a simple resource, server not running", function () {
                server.addResource(simpleResourceInfo);

                expect(server.resources.length).toBe(1);
                expect(server.resources[0].name).toBe(simpleResourceInfo.name);
                expect(server.resources[0].idField).toBe(simpleResourceInfo.idField);
                expect(server.resources[0].controller).toBe(controller);
            });

            it("should have 5 routes registered", function () {
                server.addResource(simpleResourceInfo);

                expect(server.routes.length).toBe(5);
                var getAllRoute = server.routes[0];
                expect(getAllRoute.verb).toBe("GET");
                expect(getAllRoute.uri).toBe("/example");
                expect(getAllRoute.repositoryMethod).toBe("getAll");
            });
        });

        describe("subResources", function () {
            it("should have 2 resources registred", function () {
                server.addResource(resourceWithSubs);
                expect(server.resources.length).toBe(2);
            });

            it("should have 10 routes registred", function () {
                server.addResource(resourceWithSubs);

                expect(server.routes.length).toBe(10);
                var routeGetSub = server.routes[6];
                expect(routeGetSub.uri).toBe("/parent/:id/sub/:subId");
            });
        });

        describe("no id field", function () {
            it("should have two routes", function () {
                server.addResource(resourceNoIdField);

                expect(server.routes.length).toBe(2);
                var routeAdd = server.routes[1];
                expect(routeAdd.uri).toBe("/example");
                expect(routeAdd.verb).toBe("POST");
            });

            it("should have 7 routes registred if subid is no id field", function () {
                server.addResource(resourceWithSubsNoIdField);

                expect(server.routes.length).toBe(7);
                var subRouteAdd = server.routes[6];
                expect(subRouteAdd.uri).toBe("/parent/:id/sub");
                expect(subRouteAdd.verb).toBe("POST");
            });
        });

        describe("getResource", function () {
            it("should get one resource", function () {
                server.addResource(simpleResourceInfo);
                var resource = server.getResource("example");
                expect(resource.name).toBe("example");
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