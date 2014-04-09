# SimpleRestfulJS

This application let you build a simple RESTful server with [NodeJS](http://nodejs.org/).

## Getting started

Clone or fork this repository, and create easily a full functional and customizable RESTful server.

### Dependencies

You need to have [nodeJS](http://nodejs.org/). Then you need these modules:

* restify
* nodeunit (if you want to run unit tests)

`npm install restify nodeunit`

### Create a simple resource

First you have to create the server and the resourceManager.

    var server = new RestServer({port : 8080});
    var resourceManager = new ResourceManager();

Then you can define the resource:

    var simpleResourceInfo = {
        name : "example",
        idField : "name",
        repositoryInfo: {
            repositoryType : "InMemoryRepository"
        }
    }

* name: the name of the resource (will be used for the routing)
* idField: the field to identify the resource
* repositoryType: the strategy to apply for your resource, the default types are "InMemoryRepository", "FileRepository", "MongoDBRepository"

You add the resource definition to the resourceManager :

`resourceManager.addResource(simpleResourceInfo);`

And finally, you create the routes via the resourceManager and run the server

    resourceManager.addToServer(server);
    server.run();

Here you are, then you can access and modify your resource with these operations:

### Operations you can call

#### Get all the resources

GET `http://localhost:8080/example`. Example result:

    [{
        "name": "example1"
    }, {
        "name": "example2"
    }]

#### Get one resource

GET `http://localhost:8080/example/example1`. Example result:

    {
        "name": "example1"
    }

#### Add a resource

POST `http://localhost:8080/example` with a body like this:

    {
        "name": "example1"
    }

#### Update a resource

POST `http://localhost:8080/example/example1` with the modified resource in the body: (TODO : use PUT instead)

    {
        "name": "example1",
        "someNewStuff" : "new stuff"
    }

#### Delete a resource

DELETE `http://localhost:8080/example/example1`.

#### Sub resources

You can specify sub resources for your resource (with the attribute subResources in your resource definition,
which contains an array of the sub resources information)

You can apply the sames operations to them, but the url would be `http://localhost:8080/example/[exampleId]/someSubResource`

### More information on the repositories

A repository is what is used to store or create a resource. Here are the default ones with their options

#### InMemoryRepository

With this strategy, the data are stored in memory and vanish when the server stop.

* defaultData: array of data to start with (default: [])

#### FileRepository

With this strategy, the data are stored in json files. The default folder is data.

#### MongoDBRepository

With this strategy, the data are stored in a [MongoDB](https://www.mongodb.org/) database. The options are:

* serverUrl : "127.0.0.1:27017"
* database : the database to store the resource documents

#### Create your own repository

To create your own repository you have to extend the BaseRepository and put it in the repository folder.
Then you can override these methods:

* getAll
* get
* add
* update
* remove
* parentDeleted