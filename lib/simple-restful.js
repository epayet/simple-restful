"use strict";
var RestServer = require("./server/RestServer");
var BaseRepository = require("./repository/BaseRepository");

function createServer(options) {
    if(!options)
        options = {port: 8080};
    return new RestServer(options);
}

function getBaseRepository() {
    return BaseRepository;
}

exports.createServer = createServer;