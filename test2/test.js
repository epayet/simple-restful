function runRepositoryTest(Repository) {
    describe("test", function () {
        var repository = new Repository();

        it("should be true", function () {
            expect(repository).toBeDefined();
        });
    });
}

module.exports = runRepositoryTest;