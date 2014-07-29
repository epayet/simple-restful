var repositoryUtil = require("../../../src/repository/repositoryUtil");
var InMemoryRepository = require("../../../src/repository/InMemoryRepository");

var dataInfo = {
    idField: "id",
    name: "simple"
};
var parentDataInfo = {
    idField: "idParent",
    name: "simple"
};
var repository = new InMemoryRepository(parentDataInfo);
var repositoryWithParent = new InMemoryRepository(dataInfo);
repository.addSubRepository(repositoryWithParent);

describe("repositoryUtil", function () {
    describe("getResourceId", function () {
        it("should get the resource id", function () {
            var resourceId = repositoryUtil.getResourceId(repository, {stuff: "stuff", idParent: "someId"});
            expect(resourceId).toBe("someId");
        });
    });

    describe("getParentId", function () {
        it("should get no parent id", function () {
            var parentId = repositoryUtil.getParentId(repository, {id: "test", someNawakStuff: "stuff"});
            expect(parentId).toBe(null);
        });

        it("should get a parent id", function () {
            var parentId = repositoryUtil.getParentId(repositoryWithParent, {idParent: "test", someNawakStuff: "stuff"});
            expect(parentId).toBe("test");
        });
    });

    describe("parentExists", function () {
        it("should not exists", function (done) {
            repositoryUtil.parentExists(repositoryWithParent, "nope", function (exists) {
                expect(exists).toBe(false);
                done();
            });
        });

        it("should exists", function (done) {
            repository.add({idParent: "yes"}, function() {
                repositoryUtil.parentExists(repositoryWithParent, "yes", function (exists) {
                    expect(exists).toBe(true);
                    done();
                });
            });
        });
    });

    describe("parentRelated", function () {
        it("should be not because no parent", function () {
            var isRelated = repositoryUtil.isParentRelated(repository, {stuff: "stuff"}, "id");
            expect(isRelated).toBe(false);
        });

        it("should not be", function () {
            var isRelated = repositoryUtil.isParentRelated(repositoryWithParent, {stuff: "stuff", idParent: "another"}, "id");
            expect(isRelated).toBe(false);
        });

        it("should be", function () {
            var isRelated = repositoryUtil.isParentRelated(repositoryWithParent, {stuff: "stuff", idParent: "id"}, "id");
            expect(isRelated).toBe(true);
        });
    });

    describe("getParentData", function () {
        it("should get the parent data", function (done) {
            var parentData = {stuff: "stuff", idParent: "parent"};
            repository.add(parentData, function() {
                repositoryUtil.getParentData(repositoryWithParent, function (data) {
                    expect(data).toEqual(parentData);
                    done();
                }, {idParent: "parent"});
            });
        });
    });

    describe("createParentData", function () {
        it("should create a parent data", function (done) {
            var parentObject = {idParent: "test"};
            repositoryUtil.createParentData(repositoryWithParent, function() {
                repository.get("test", function (data) {
                    expect(data).toEqual(parentObject);
                    done();
                });
            }, parentObject);
        });
    });

    describe("createEmptyParentData", function () {
        it("should create an empty parent data", function () {
            var emptyParent = repositoryUtil.createEmptyParentData(repositoryWithParent, "test");
            expect(emptyParent).toEqual({idParent: "test"});
        });
    });

    describe("prepareParentAndChildForAdd", function () {
        it("should prepare nothing (no parent)", function (done) {
            var entryResource = {stuff: "stuff"};
            repositoryUtil.prepareParentAndChildForAdd(repository, entryResource, function(preparedResource) {
                expect(preparedResource).toEqual(entryResource);
                done();
            });
        });

        it("should prepare the data", function (done) {
            var entryResource = {stuff: "stuff"};
            repositoryUtil.prepareParentAndChildForAdd(repositoryWithParent, entryResource, function(preparedResource) {
                expect(preparedResource).toEqual({stuff: "stuff", idParent: "parent"});
                done();
            }, {idParent: "parent"});
        });
    });

    describe("addParentIdIfNotExist", function () {
        it("should add a parent", function () {
            var resource = repositoryUtil.addParentIdIfNotExist(repositoryWithParent, {stuff: "stuff"}, "parent");
            expect(resource).toEqual({stuff: "stuff", idParent: "parent"});
        });
    });
});