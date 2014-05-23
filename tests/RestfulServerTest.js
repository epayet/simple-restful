var RestfulServer = require("../src/RestfulServer");
var request = require("request");
var restify = require("restify");
var InMemoryRepository = require("../src/repository/InMemoryRepository");

var server, client;

var simpleResourceInfo = getTestData("simpleResource");

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
        addSimpleResource_ServerNotRunning: function(assert) {
            server.addResource(simpleResourceInfo);

            assert.equals(server.resources.length, 1);
            assert.same(server.resources[0].name, simpleResourceInfo.name);
            assert.same(server.resources[0].idField, simpleResourceInfo.idField);
            assert.ok(server.resources[0].repository instanceof InMemoryRepository);
            assert.equals(server.server.isRunning, false);
            assert.done();
        },

        run_ServerRunning: function(assert) {
            server.run();

            request.get("http://localhost:8081", function (err, res, body) {
                assert.notEqual(res, undefined);
                assert.equal(err, undefined);
                assert.equals(server.server.isRunning, true);
                assert.done();
            });
        },

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

                client.post("/example", {"name": "test"}, function () {
                    client.get("/example", function (err, req, res, obj) {
                        assert.equal(obj.length, 1);
                        assert.done();
                    });
                });
            }
        }
    }
};

function getTestData(data) {
    switch(data) {
        case "simpleResource":
            return {
                name: "example",
                idField: "name",
                repository: "InMemory"
            };
    }
}