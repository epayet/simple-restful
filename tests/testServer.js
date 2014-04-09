var RestServer = require("../lib/server/RestServer");
var restify = require("restify");

var server, client;

module.exports = {
    setUp : function(callback) {
        server = setupServer();
        client = restify.createJsonClient({url: "http://localhost:8081"});
        callback();
    },

    tearDown: function(callback) {
        server.close();
        client.close();
        callback();
    },

    simpleCrud: {
        getAll_empty: function (assert) {
            client.get("/example", function (err, req, res, obj) {
                assert.same(obj, []);
                assert.done();
            });
        },

        addResource_getAll_One: function (assert) {
            client.post("/example", {"name": "test"}, function () {
                client.get("/example", function (err, req, res, obj) {
                    assert.equal(obj.length, 1);
                    assert.done();
                });
            });
        },

        update_changed: function (assert) {
            client.post("/example", {"name": "test", someData: "data"}, function () {
                var resourceUpdated = {"name": "test", someData: "dataChanged"};
                client.put("/example/test", resourceUpdated, function () {
                    client.get("/example/test", function (err, req, res, obj) {
                        assert.equal(obj.someData, "dataChanged");
                        assert.done();
                    });
                });
            });
        },

        delete_noneAfter: function (assert) {
            client.post("/example", {"name": "test"}, function () {
                client.del("/example/test", function () {
                    client.get("/example", function (err, req, res, obj) {
                        assert.same(obj, []);
                        assert.done();
                    });
                })
            });
        }
    }
};

function setupServer() {
    var server = new RestServer({port: 8081});
    var simpleResourceInfo = {
        name: "example",
        idField: "name",
        repository: server.getRepository("InMemory")
    };
    server.addResource(simpleResourceInfo);
    server.run();
    return server;
}