var DataController = require("../../../src/controller/DataController");
var InMemoryRepository = require("../../../src/repository/InMemoryRepository");

var simpleDataInfo = getTestData("simple");
var simpleDataController;

describe("DataController", function () {

    beforeEach(function () {
        simpleDataController = new DataController(simpleDataInfo);
    });

    describe("initialization", function () {
        it("should be initialized", function () {
            expect(simpleDataController).toBeDefined();
            expect(simpleDataController.repository instanceof InMemoryRepository).toBe(true);
        });

        it("should reuse instance instead of creating one", function () {
            var info = {
                instance: function(){}
            };
            var controller = new DataController(info);
            expect(controller.repository).toBe(info.instance);
        });
    });

    describe("getAll", function () {
        it("should get all", function (done) {
            simpleDataController.getAll(function (data) {
                expect(data).toEqual([]);
                done();
            });
        });
    });

    describe("get", function () {
        it("should get", function (done) {
            var expectedData = {id: 1};
            simpleDataController.repository.data = [expectedData];
            simpleDataController.get(1, function (data) {
                expect(data).toEqual(expectedData);
                done();
            });
        });
    });

    describe("add", function () {
        it("should add", function (done) {
            var expectedData = {stuff: "stuff"};
            simpleDataController.add(expectedData, function () {
                expect(simpleDataController.repository.data[0]).toEqual(expectedData);
                done();
            });
        });
    });

    describe("update", function () {
        it("should update", function (done) {
            simpleDataController.repository.data = [{id: 1}];
            simpleDataController.update({id: 1, stuff: "stuff"}, function (data) {
                expect(data).toEqual({id: 1, stuff: "stuff"});
                done();
            });
        });
    });

    describe("remove", function() {
        it("should remove", function (done) {
            simpleDataController.repository.data = [{id: 1}];
            simpleDataController.remove(1, function () {
                expect(simpleDataController.repository.data).toEqual([]);
                done();
            });
        });
    });
});

function getTestData(data) {
    switch (data) {
        case "simple":
            return {
                name: "example",
                idField: "id",
                repository: "InMemory"
            };
    }
}