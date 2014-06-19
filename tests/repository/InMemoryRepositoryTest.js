var TestRepository = require("./../../testUtil/BaseRepositoryTest");
var InMemoryRepository = require("../../src/repository/InMemoryRepository");

module.exports = TestRepository.testRepository(InMemoryRepository);