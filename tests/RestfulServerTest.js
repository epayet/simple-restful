var RestfulServer = require("../src/RestfulServer");
var request = require("request");
var restify = require("restify");
var InMemoryRepository = require("../src/repository/InMemoryRepository");

var server, client;

var simpleResourceInfo = getTestData("simpleResource");
var resourceWithSubs = getTestData("resourceWithSubs");

module.exports = {
    setUp: function(callback) {
        server = new RestfulServer({port: 8081});
        server.registerRepositories({
            "InMemory": InMemoryRepository
        });
        client = restify.createJsonClient({url: "http://localhost:8081"});
        callback();
    },

    tearDown: function(callback) {
        server.close();
        client.close();
        callback();
    },

    resource: {
        simple: {
            addSimpleResource_ServerNotRunning: function (assert) {
                server.addResource(simpleResourceInfo);

                assert.equals(server.resources.length, 1);
                assert.same(server.resources[0].name, simpleResourceInfo.name);
                assert.same(server.resources[0].idField, simpleResourceInfo.idField);
                assert.ok(server.resources[0].repository instanceof InMemoryRepository);
                assert.equals(server.server.isRunning, false);
                assert.done();
            },

            addResource_5RoutesRegistred: function(assert) {
                server.addResource(simpleResourceInfo);

                assert.equals(server.routes.length, 5);
                var getAllRoute = server.routes[0];
                assert.equals(getAllRoute.verb, "GET");
                assert.equals(getAllRoute.uri, "/example");
                assert.equals(getAllRoute.repositoryMethod, "getAll");
                assert.done();
            }
        },

        subResources: {
            addResourceWithSubs_2resourcesRegistred: function(assert) {
                server.addResource(resourceWithSubs);

                assert.equals(server.resources.length, 2);
                assert.done();
            },

            addResource_10RoutesRegistred: function(assert) {
                server.addResource(resourceWithSubs);

                assert.equals(server.routes.length, 10);
                var routeGetSub = server.routes[6];
                assert.equals(routeGetSub.uri, "/parent/:id/sub/:subId");
                assert.done();
            }
        }
    },

    runServer: {
        simpleRoutes: {
            getAll_Empty: function (assert) {
                server.addResource(simpleResourceInfo);
                server.run();

                client.get("/example", function (err, req, res, obj) {
                    assert.same(obj, []);
                    assert.done();
                });
            },

            addResource_getAll_One: function (assert) {
                server.addResource(simpleResourceInfo);
                server.run();

                var objInserted = {"name": "test"};
                client.post("/example", objInserted, function () {
                    client.get("/example", function (err, req, res, obj) {
                        assert.equal(obj.length, 1);
                        assert.same(obj[0], objInserted);
                        assert.done();
                    });
                });
            },

            addResource_getOne: function (assert) {
                server.addResource(simpleResourceInfo);
                server.run();

                var objInserted = {"name": "test"};
                client.post("/example", objInserted, function () {
                    client.get("/example/test", function (err, req, res, obj) {
                        assert.same(obj, objInserted);
                        assert.done();
                    });
                });
            },

            updateResource_resourceChanged: function (assert) {
                server.addResource(simpleResourceInfo);
                server.run();

                var objInserted = {"name": "test"};
                client.post("/example", objInserted, function () {
                    var objChanged = {"name": "test", someStuff: "stuff"};
                    client.put("/example/test", objChanged, function () {
                        client.get("/example/test", function (err, req, res, obj) {
                            assert.same(obj, objChanged);
                            assert.done();
                        });
                    });
                });
            },

            deleteAfterAdded: function (assert) {
                server.addResource(simpleResourceInfo);
                server.run();

                client.post("/example", {name: "test"}, function () {
                    client.del("/example/test", function () {
                        client.get("/example", function (err, req, res, obj) {
                            assert.equals(obj.length, 0);
                            assert.done();
                        });
                    });
                });
            }
        },

        subResource: {
            getAll_Empty: function (assert) {
                prepareServerForSubResources(function () {
                    client.get("/parent/1/sub", function (err, req, res, obj) {
                        assert.same(obj, []);
                        assert.done();
                    });
                });
            }
        }
    }
};

function prepareServerForSubResources(callback) {
    server.addResource(resourceWithSubs);
    server.run();
    addParentData(1, function () {
        addParentData(2, function () {
            callback();
        });
    });
}

function addParentData(id, callback) {
    client.post("/parent", {id: id}, function () {
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
    }
}