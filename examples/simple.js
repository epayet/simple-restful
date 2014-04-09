var simpleRest = require('simple-rest');

var server = new simpleRest.createServer();

var simpleResourceInfo = {
    name: "example",
    idField: "name",
    repository: server.getRepository("InMemory")
};
server.addResource(simpleResourceInfo);
server.run();