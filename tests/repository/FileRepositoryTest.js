var TestRepository = require("./BaseRepositoryTest");
var FileRepository = require("../../src/repository/FileRepository");

module.exports = TestRepository.testRepository(FileRepository, {
    folderPath: "C:\\Users\\emmanuel.payet\\Documents\\Projects\\Angular-Seed\\rest-server\\test_data"
});