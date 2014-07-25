var RestfulServer = require("../../src/RestfulServer");
var restify = require("restify");
var InMemoryRepository = require("../../src/repository/InMemoryRepository");

var server, client;

var simpleResourceInfo = getTestData("simpleResource");
var resourceWithSubs = getTestData("resourceWithSubs");
var resourceNoIdField = getTestData("resourceNoIdField");
var resourceWithSubsNoIdField = getTestData("resourceWithSubsNoIdField");


//TODO expect(server.server.isRunning).toBe(false);
describe("RestfulServer Integration", function () {
    beforeEach(function () {
        server = new RestfulServer({port: 8081, debug:false});
        server.registerRepositories({
            "InMemory": InMemoryRepository
        });
        client = restify.createJsonClient({url: "http://localhost:8081"});
    });

    afterEach(function () {
        server.close();
        client.close();
    });

    describe("simple routes", function () {
        it("should get all and get empty", function (done) {
            server.addResource(simpleResourceInfo);
            server.run();

            client.get("/example", function (err, req, res, obj) {
                expect(obj).toEqual([]);
                done();
            });
        });

        it("should add a resource and then getAll have one", function (done) {
            server.addResource(simpleResourceInfo);
            server.run();

            var objInserted = {"name": "test"};
            client.post("/example", objInserted, function () {
                client.get("/example", function (err, req, res, obj) {
                    expect(obj.length).toBe(1);
                    expect(obj[0]).toEqual(objInserted);
                    done();
                });
            });
        });

        it("should add a resource and then get one", function (done) {
            server.addResource(simpleResourceInfo);
            server.run();

            var objInserted = {"name": "test"};
            client.post("/example", objInserted, function () {
                client.get("/example/test", function (err, req, res, obj) {
                    expect(obj).toEqual(objInserted);
                    done();
                });
            });
        });

        it("should update a resource and be changed", function (done) {
            server.addResource(simpleResourceInfo);
            server.run();

            var objInserted = {"name": "test"};
            client.post("/example", objInserted, function () {
                var objChanged = {"name": "test", someStuff: "stuff"};
                client.put("/example/test", objChanged, function () {
                    client.get("/example/test", function (err, req, res, obj) {
                        expect(obj).toEqual(objChanged);
                        done();
                    });
                });
            });
        });

        it("should delete a resource", function (done) {
            server.addResource(simpleResourceInfo);
            server.run();

            client.post("/example", {name: "test"}, function () {
                client.del("/example/test", function () {
                    client.get("/example", function (err, req, res, obj) {
                        expect(obj.length).toBe(0);
                        done();
                    });
                });
            });
        });
    });

    describe("sub resource", function () {
        it("should getAll empty", function (done) {
            prepareServerForSubResources(function () {
                client.get("/parent/1/sub", function (err, req, res, obj) {
                    expect(obj).toEqual([]);
                    done();
                });
            });
        });

        it("should add a resource and getAll one", function (done) {
            prepareServerForSubResources(function () {
                client.post("/parent/1/sub", {"subId": "test"}, function () {
                    client.get("/parent/1/sub", function (err, req, res, obj) {
                        expect(obj.length).toBe(1);
                        //id parent appeared
                        //TODO should be an int ?
                        expect(obj[0]).toEqual({"subId": "test", id: "1"});
                        done();
                    });
                });
            });
        });

        it("should delete a parent and subs disappear", function (done) {
            prepareServerForSubResources(function () {
                //Add one sub
                client.post("/parent/1/sub", {subId: 1}, function (err) {
                    //Check there is 1 sub
                    client.get("/parent/1/sub", function (err, req, res, obj) {
                        expect(obj.length).toBe(1);
                        //Delete parent
                        client.del("/parent/1", function () {
                            //Check no sub exists anymore
                            client.get("/parent/1/sub", function (err, req, res, obj) {
                                expect(obj.length).toBe(0);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    //TODO noIdField: means no add method, only update and {} by default
});

function prepareServerForSubResources(callback) {
    server.addResource(resourceWithSubs);
    server.run();
    client.post("/parent", {id: 1}, function () {
        callback();
    });
}

function getTestData(data) {
    switch(data) {
        case "simpleResource":
            return {
                name: "example",
                idField: "name",
                repository: "InMemory"
            };
        case "resourceWithSubs":
            return {
                name: "parent",
                idField: "id",
                repository: "InMemory",
                subResources: [
                    {
                        name: "sub",
                        idField: "subId",
                        repository: "InMemory"
                    }
                ]
            };
        case "resourceWithSubsNoIdField":
            return {
                name: "parent",
                idField: "id",
                repository: "InMemory",
                subResources: [
                    {
                        name: "sub",
                        repository: "InMemory"
                    }
                ]
            };
        case "resourceNoIdField":
            return {
                name: "example",
                repository: "InMemory"
            };
        case "resourceWithLinked":
            return {
                name: "some",
                repository: "InMemory",
                linkedResourcesNames: ["example"]
            };
    }
}