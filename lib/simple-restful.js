"use strict";
var RestServer = require("./server/RestServer");

function createServer(options) {
    if(!options)
        options = {port: 8080};
    return new RestServer(options);
}

exports.createServer = createServer;