var simpleRestful = require('simple-restful');
var server = new simpleRestful.createServer();

var simpleResourceInfo = {
    name: "example",
    idField: "name",
    repository: server.getRepository("InMemory")
};
server.addResource(simpleResourceInfo);
server.run();