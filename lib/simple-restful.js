"use strict";
var RestServer = require("./server/RestServer");
var BaseRepository = require("./repository/BaseRepository");
var InMemoryRepository = require("./repository/InMemoryRepository");
var FileRepository = require("./repository/FileRepository");
var MongoDBRepository = require("./repository/MongoDBRepository");

function createServer(options) {
    if(!options)
        options = {port: 8080};
    return new RestServer(options);
}

function getDefaultRepository(repositoryName) {
    var repositories = {
        "InMemory": InMemoryRepository,
        "File": FileRepository,
        "MongoDB": MongoDBRepository
    };
    return repositories[repositoryName];
}

exports.createServer = createServer;
exports.BaseRepository = BaseRepository;
exports.getDefaultRepository = getDefaultRepository;