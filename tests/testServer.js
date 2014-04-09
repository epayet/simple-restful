var RestServer = require("../lib/server/RestServer");
var restify = require("restify");
var BaseRepository = require("../lib/repository/BaseRepository");

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
    },

    //TODO sub resources

    customRepository : {
        consoleRepository : function(assert) {
            client.get("/repository/test", function(err, req, res, obj) {
                assert.equals(obj, "test");
                assert.done();
            });
        }
    }
};

function setupServer() {
    var server = new RestServer({port: 8081});

    //repository
    var EchoRepository = function(dataInfo, options) {
        BaseRepository.call(this, dataInfo, options);
    };

    EchoRepository.prototype = Object.create(BaseRepository.prototype);
    EchoRepository.prototype.get = function(resourceId, callback) {
        callback(resourceId);
    };
    server.registerRepository("Echo", EchoRepository);

    //resources
    var simpleResourceInfo = {
        name: "example",
        idField: "name",
        repository: server.getRepository("InMemory")
    };
    server.addResource(simpleResourceInfo);

    var testRepositoryInfo = {
        name: "repository",
        idField: "name",
        repository: server.getRepository("Echo")
    };
    server.addResource(testRepositoryInfo);
    server.run();
    return server;
}