var BaseRepository = require("./repository/BaseRepository");
var InMemoryRepository = require("./repository/InMemoryRepository");
var FileRepository = require("./repository/FileRepository");
var MongoDBRepository = require("./repository/MongoDBRepository");
var RestfulServer = require("./RestfulServer");

var defaultRepositories = {
    "InMemory": InMemoryRepository,
    "File": FileRepository,
    "MongoDB": MongoDBRepository
};

function createServer(options) {
    var server = new RestfulServer(options);
    server.registerRepositories(defaultRepositories);
    return server;
}

function getDefaultRepository(name) {
    return defaultRepositories[name];
}

exports.createServer = createServer;
exports.BaseRepository = BaseRepository;
exports.getDefaultRepository = getDefaultRepository;
