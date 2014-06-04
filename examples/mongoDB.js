var simpleRestful = require("simple-restful");

var server = simpleRestful.createServer({port: 8081});

//this will create a database testSimpleRestful and a collection named example
var exampleResourceInfo = {
    name: "example",
    idField: "id",
    repository: "MongoDB",
    repositoryOptions: {
        mongoOptions: {
            serverUrl: "127.0.0.1:27017",
            database: "testSimpleRestful"
        }
    }
};
server.addResource(exampleResourceInfo);
server.run();