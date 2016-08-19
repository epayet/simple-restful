var simpleRestful = require('simple-restful');

class ConsoleRepository {
  constructor(options) {}

  getAll() {
    console.log('getAll method called')
  }

  get(id) {
    console.log(`get(${id} called`)
  }

  add(newData) {
    console.log('add called')
  }

  update(id, newData) {
    console.log(`update(${id} called`)
  }

  delete(id) {
    console.log(`delete(${id} called`)
  }
}

var server = simpleRestful.createServer({port:8081});

// Register the custom repository
server.addRepository("Console", ConsoleRepository);

// And finally create a resource that use this repository class
var testRepositoryInfo = {
    name: "example",
    repository: "Console",     // Use it like this
    repositoryOptions: {}      // constructor options
};
server.addResource(testRepositoryInfo);
server.run();

// Each time you use this resource, it will only log stuff and not store anything, according to this repository