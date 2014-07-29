var RestfulServer = require("../../src/RestfulServer");

var server;

var controller = new function(){};

var simpleResourceInfo = getTestData("simpleResource");

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

        it("should add even if info is a repository", function () {
            var info = {
                info: simpleResourceInfo
            };
            server.addResource(info);
            var resource = server.resources[0];
            expect(resource.idField).toBe("name");
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
    }
}