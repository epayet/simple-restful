var BaseRepository = require("./repository/BaseRepository");
var InMemoryRepository = require("./repository/InMemoryRepository");
var FileRepository = require("./repository/FileRepository");
var MongoDBRepository = require("./repository/MongoDBRepository");
var RestfulServer = require("./RestfulServer");
var repositoryUtil = require("./repository/repositoryUtil");
var DataController = require("./controller/DataController");
var repositoryFactory = require("./repository/repositoryFactory");

var repository = {
    "InMemoryRepository": InMemoryRepository,
    "FileRepository": FileRepository,
    "MongoDBRepository": MongoDBRepository
};

function createServer(options) {
    var server = new RestfulServer(options);
    return server;
}

exports.createServer = createServer;
exports.createRepository = repositoryFactory.createRepository;
exports.BaseRepository = BaseRepository;
exports.repository = repository;
exports.repositoryUtil = repositoryUtil;
exports.DataController = DataController;