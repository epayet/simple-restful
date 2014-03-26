var TestRepository = require("./modules/repository/TestRepository");

var repositoryInfo = {
    repositoryType:"InMemoryRepository"
    //repositoryType:"FileRepository"

    //mongodb
    /*repositoryType:"MongoDBRepository",
     serverUrl : "127.0.0.1:27017",
     database : "test_repository"*/
};
module.exports = TestRepository.testRepository(repositoryInfo);
