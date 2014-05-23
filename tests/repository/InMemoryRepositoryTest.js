var TestRepository = require("./BaseRepositoryTest");
var InMemoryRepository = require("../../src/repository/InMemoryRepository");

module.exports = TestRepository.testRepository(InMemoryRepository);