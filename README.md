# SimpleRestful

With this module, you can easily create a complete JSON based RESTful API with just a few lines.
You can use existing storage strategies (MongoDB, files, InMemory for tests, etc.) or even create your own.

## Getting started

### Installation

`npm install simple-restful`

### Create a simple resource

Here the few lines to create you first resource:

    var simpleRestful = require('simple-restful');
    var server = new simpleRestful.createServer({port: 8080});

    //The minimum information to define the resource
    var simpleResourceInfo = {
        name: "example",
        idField: "name",
        repository: "InMemory"
    };

    //register the resource and then run
    server.addResource(simpleResourceInfo);
    server.run();

These lines mean you created the routes for the "example" resource, and everything will be stored in memory (not persisted).

Here the routes created:

* GET       /example            (get all the resources in an array)
* GET       /example/:name      (get one resource by id)
* POST      /example            (create a new resource)
* PUT       /example/:name      (update a resource)
* DELETE    /example/:name      (delete a resource)

### Repositories

A repository is like a box containing and handling the resources. Here are the defaults one, but you can create your own.

The options can be specified this way in the resource definition:

    var simpleResourceInfo = {
        name: "example",
        idField: "name",
        repository: "MongoDB",
        repositoryOptions: {
            mongoOptions: {
                serverUrl: "127.0.0.1:27017",
                database: "testSimpleRestful"
            }
        }
    };

#### InMemoryRepository (InMemory)

With this strategy, the data are stored in memory and vanish when the server stops. Options:

* defaultData: array of data to start with (default: [])

#### FileRepository (File)

With this strategy, the data are stored in json files. The default folder is data. Options:

* folderPath: the folder path for the data

#### MongoDBRepository (MongoDB)

With this strategy, the data are stored in a MongoDB database. See the 
[example](https://github.com/epayet/SimpleRestJS/blob/master/examples/mongoDB.js). Options:

* serverUrl : "127.0.0.1:27017"
* database : the database name to store the resource documents

##### More are coming

#### Custom repositoy
 
You can create you own repository as well by overwriting basic methods. Here is an 
[example](https://github.com/epayet/SimpleRestJS/blob/master/examples/customRepository.js)

Here are the methods you can override:

* getAll
* get
* add
* update
* remove
* parentDeleted

### Sub resources

You can specify sub resources for your resource (with the attribute subResources in your resource definition,
which contains an array of the sub resources information)

You can apply the sames operations to them, but the url would be `http://localhost:8080/example/[exampleId]/someSubResource`

### TODO

* example for sub resources
* example for linked resources
* methods of repositoryUtil