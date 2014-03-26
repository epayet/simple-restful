var RestServer = require('./modules/server/RestServer');
var ResourceManager = require('./modules/server/ResourceManager');

var server = new RestServer({port : 8080});
var resourceManager = new ResourceManager();

var simpleResourceInfo = {
    name : "example",
    idField : "name",
    repositoryInfo: {
        repositoryType : "InMemoryRepository",
        defaultData : [{
            name : "test",
            message : "World"
        }]
    },
    subResources : [
        {
            name : "sub",
            idField : "id",
            repositoryInfo: {
                repositoryType : "InMemoryRepository"
            }
        }
    ]
};
resourceManager.addResource(simpleResourceInfo);
resourceManager.addToServer(server);
server.run();