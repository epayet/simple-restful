var RestfulServer = require("../../src/RestfulServer");
var restify = require("restify");
var server, client;

var simpleController = new FakeController();
var missingMethodsController = new function(){};

var simpleResourceInfo = getTestData("simpleResource");
var missingMethodsResourceInfo = getTestData("missingMethodsResources");


//TODO expect(server.server.isRunning).toBe(false);
describe("RestfulServer Integration", function () {
    beforeEach(function () {
        server = new RestfulServer({port: 8081, debug:false});
        client = restify.createJsonClient({url: "http://localhost:8081"});
    });

    afterEach(function () {
        server.close();
        client.close();
    });

    describe("simple resource simple controller", function () {
        it("should GET all", function (done) {
            runSimpleResource();
            client.get("/example", function (err, req, res, data) {
                expect(data).toEqual([]);
                done();
            });
        });

        it("should GET", function (done) {
            runSimpleResource();
            client.get("/example/aa", function (err, req, res, data) {
                expect(data).toEqual("aa");
                done();
            });
        });

        it("should POST", function (done) {
            runSimpleResource();
            var expectedData = {data: "stuff"};
            client.post("/example", expectedData, function (err, req, res, data) {
                expect(data).toEqual(expectedData);
                done();
            });
        });

        it("should PUT", function (done) {
            runSimpleResource();
            var expectedData = {data: "stuff"};
            client.put("/example/aa", expectedData, function (err, req, res, data) {
                expect(data).toEqual(expectedData);
                done();
            });
        });

        it("should DELETE", function (done) {
            runSimpleResource();
            client.del("/example/aa", function (err, req, res, data) {
                expect(data).toBe("aa");
                done();
            });
        });
    });

    describe("missing controller method", function () {
        it("should get a 404", function (done) {
            server.addResource(missingMethodsResourceInfo);
            server.run();
            client.get("/missing", function (err, req, res, data) {
                expect(res.statusCode).toBe(404);
                done();
            });
        });
    });
});

function runSimpleResource() {
    server.addResource(simpleResourceInfo);
    server.run();
}

function getTestData(data) {
    switch(data) {
        case "simpleResource":
            return {
                name: "example",
                idField: "name",
                controller : simpleController
            };
        case "missingMethodsResources":
            return {
                name: "missing",
                controller : missingMethodsController
            };
    }
}

function FakeController() {

}

FakeController.prototype.getAll = function(callback, additionalIdentifiers) {
    callback([]);
};

FakeController.prototype.get = function(id, callback, additionalIdentifiers) {
    callback(id);
};

FakeController.prototype.add = function(resource, callback, additionalIdentifiers) {
    callback(resource);
};

FakeController.prototype.update = function(resource, callback, additionalIdentifiers) {
    callback(resource);
};

FakeController.prototype.remove = function(id, callback, additionalIdentifiers) {
    callback(id);
};