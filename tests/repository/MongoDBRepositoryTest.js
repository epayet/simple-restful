var TestRepository = require("./../../testUtil/BaseRepositoryTest");
var MongoDBRepository = require("../../src/repository/MongoDBRepository");

module.exports = TestRepository.testRepository(MongoDBRepository, {
    mongoOptions: {
        serverUrl : "127.0.0.1:27017",
        database : "test_repository"
    }
});