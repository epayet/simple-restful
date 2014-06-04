var simpleRestful = require('simple-restful');

var server = simpleRestful.createServer({port:8081, debug:true});
var BaseRepository = simpleRestful.BaseRepository;

//Goal of this repository: log the resource asked by GET /repository/someResource
//new repository constructor
//simple dataInfo : {idField: "name", name: "example"}
var ConsoleLogRepository = function(dataInfo, options) {
    //call the parent constructor
    BaseRepository.call(this, dataInfo, options);
};

//get the base methods
ConsoleLogRepository.prototype = Object.create(BaseRepository.prototype);
//override the get method, and log the resource asked
ConsoleLogRepository.prototype.get = function(resourceId, callback) {
    console.log("resource asked: " + resourceId);
    callback();
};
//register the ConsoleLogRepository
server.registerRepository("ConsoleLog", ConsoleLogRepository);

//and finally create a resource that use this repository class
var testRepositoryInfo = {
    name: "repository",
    idField: "name",
    repository: "ConsoleLog"
};
server.addResource(testRepositoryInfo);
server.run();