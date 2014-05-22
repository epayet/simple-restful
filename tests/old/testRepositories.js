var TestRepository = require("../../lib/repository/TestRepository");

var repositoryInfo = {
    repositoryType:"InMemoryRepository"

    //File
    /*repositoryType:"FileRepository",
    folderPath: "C:\\Users\\emmanuel.payet\\Documents\\Projects\\Angular-Seed\\rest-server\\test_data"*/

    //mongodb
    /*repositoryType:"MongoDBRepository",
     serverUrl : "127.0.0.1:27017",
     database : "test_repository"*/
};
module.exports = TestRepository.testRepository(repositoryInfo);
