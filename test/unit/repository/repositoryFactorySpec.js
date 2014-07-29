var repositoryFactory = require("../../../src/repository/repositoryFactory");
var InMemoryRepository = require("../../../src/repository/InMemoryRepository");

describe("repositoryFactory", function () {
    describe("createRepository", function () {
        it("should get the access methods and info + instance", function () {
            var options = {option: 1};
            var repository = repositoryFactory.createRepository({
                name: "test",
                repository: "InMemory"
            }, options);
            expect(repository.get).toBeDefined();
            expect(repository.getAll).toBeDefined();
            expect(repository.add).toBeDefined();
            expect(repository.update).toBeDefined();
            expect(repository.remove).toBeDefined();
            expect(repository.info).toEqual({
                name: "test",
                repository: "InMemory",
                repositoryOptions: options
            });
            expect(repository.instance instanceof InMemoryRepository).toBe(true);
        });
    });
});