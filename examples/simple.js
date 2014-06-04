var simpleRestful = require('simple-restful');
var server = new simpleRestful.createServer({port: 8081, debug: true});

var simpleResourceInfo = {
    name: "example",
    idField: "name",
    repository: "InMemory"
};
server.addResource(simpleResourceInfo);
server.run();