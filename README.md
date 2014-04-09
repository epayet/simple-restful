# SimpleRestfulJS

With this module, you can easily create a complete JSON based RESTful API with just a few lines.
You can use existing storage strategies (MongoDB, files, InMemory for tests, etc.) or even create your own.

## Getting started

### Installation

`npm install simple-restful`

### Create a simple resource

Here the few lines to create you first resource:

    var simpleRestful = require('simple-restful');
    var server = new simpleRestful.createServer(); // use the port 8080 by default

    //The minimum information to define the resource
    var simpleResourceInfo = {
        name: "example",
        idField: "name",
        repository: server.getRepository("InMemory")
    };

    //register the resource
    server.addResource(simpleResourceInfo);
    //add the routes and run the server
    server.run();

These lines mean you created the routes for the "example" resource, and everything will be stored in memory (not persisted).

Here the routes created:

* GET       /example            (get all the resources in an array)
* GET       /example/:name      (get one resource by id)
* POST      /example            (create a new resource
* PUT       /example/:name      (update a resource)
* DELETE    /example/:name      (delete a resource)

### Create your own repository

Here an example to create a custom repository that override a method and log in the console the resource asked.

    var simpleRestful = require('simple-restful');
    var server = simpleRestful.createServer();
    var BaseRepository = simpleRestful.BaseRepository;

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
        repository: server.getRepository("ConsoleLog")
    };
    server.addResource(testRepositoryInfo);
    server.run();

Here are the methods you can override:

* getAll
* get
* add
* update
* remove
* parentDeleted

#### InMemoryRepository (InMemory)

With this strategy, the data are stored in memory and vanish when the server stops. Options:

* defaultData: array of data to start with (default: [])

#### FileRepository (File)

With this strategy, the data are stored in json files. The default folder is data. Options:

* folderPath: the folder path for the data

#### MongoDBRepository (MongoDB)

With this strategy, the data are stored in a [MongoDB](https://www.mongodb.org/) database. Options:

* serverUrl : "127.0.0.1:27017"
* database : the database name to store the resource documents

#### More are coming

### Sub resources

You can specify sub resources for your resource (with the attribute subResources in your resource definition,
which contains an array of the sub resources information)

You can apply the sames operations to them, but the url would be `http://localhost:8080/example/[exampleId]/someSubResource`

### TODO

* Continue the doc
* Create an API explorer/documentation
* Do more examples and tests
