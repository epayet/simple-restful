# SimpleRestful

[![Build Status](https://travis-ci.org/epayet/SimpleRestJS.svg?branch=v2)](https://travis-ci.org/epayet/SimpleRestJS)

With this module, you can easily create a complete JSON based RESTful API with just a few lines.
You can use existing storage strategies (MongoDB, files, InMemory for tests, etc.) or even create your own.

## Installation

`npm install simple-restful`

## Usage

Here the few lines to create you first resource:

```javascript
var simpleRestful = require('simple-restful');
var server = new simpleRestful.createServer({port: 8080});

//The minimum information to define the resource
var simpleResourceInfo = {
    name: "example",
    repository: "InMemory"
};

//register the resource and then run
server.addResource(simpleResourceInfo);
server.start();
```

These lines mean you created the routes for the "example" resource, and everything will be stored in memory 
(not persisted).

Here the routes created:

* GET       /example            (get all the resources in an array)
* GET       /example/:__id      (get one resource by id)
* POST      /example            (create a new resource)
* PUT       /example/:__id      (update a resource)
* DELETE    /example/:__id      (delete a resource)

### Repositories

A repository is like a box containing and handling the resources. Here are the defaults one, but you can create your own.

#### InMemoryRepository (InMemory)

With this strategy, the data are stored in memory and vanish when the server stops. Options:

TODO

* defaultData: array of data to start with (default: [])

#### FileRepository (File)

TODO

With this strategy, the data are stored in json files. The default folder is data. Options:

* folderPath: the folder path for the data

#### MongoDBRepository (MongoDB)

TODO

With this strategy, the data are stored in a MongoDB database. See the 
[example](https://github.com/epayet/SimpleRestJS/blob/master/examples/mongoDB.js). 

Example:

```javascript
var simpleResourceInfo = {
    name: "example",
    repository: "MongoDB",
    repositoryOptions: {
        mongoOptions: {
            serverUrl: "127.0.0.1:27017",
            database: "testSimpleRestful"
        }
    }
};
```

#### Custom repository
 
TODO

You can create you own repository as well by overwriting basic methods. Here is an 
[example](https://github.com/epayet/SimpleRestJS/blob/master/examples/customRepository.js)

Here are the methods you can override:

* getAll
* get
* add
* update
* remove
* parentDeleted

## Options

```javascript
var simpleRestful = require('simple-restful');
var server = new simpleRestful.createServer({
    port: 8080,
    logLevel: 'error' // Can be error, warn, info, verbose, debug, silly
});
```
