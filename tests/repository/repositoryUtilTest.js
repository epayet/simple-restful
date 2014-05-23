var repositoryUtil = require("../../src/repository/repositoryUtil");
var InMemoryRepository = require("../../src/repository/InMemoryRepository");

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

module.exports = {
    getResourceId: function(assert) {
        var resourceId = repositoryUtil.getResourceId(repository, {stuff: "stuff", idParent: "someId"});
        assert.equals(resourceId, "someId");
        assert.done();
    },

    getParentId: {
        noParent: function (assert) {
            var parentId = repositoryUtil.getParentId(repository, {id: "test", someNawakStuff: "stuff"});

            assert.equals(parentId, null);
            assert.done();
        },

        withParent: function(assert) {
            var parentId = repositoryUtil.getParentId(repositoryWithParent, {idParent: "test", someNawakStuff: "stuff"});

            assert.equals(parentId, "test");
            assert.done();
        }
    },

    parentExists: {
        noExists: function(assert) {
            repositoryUtil.parentExists(repositoryWithParent, "nope", function (exists) {
                assert.equals(exists, false);
                assert.done();
            });
        },

        exists: function(assert) {
            repository.add({idParent: "yes"}, function() {
                repositoryUtil.parentExists(repositoryWithParent, "yes", function (exists) {
                    assert.equals(exists, true);
                    assert.done();
                });
            });
        }
    },

    isParentRelated: {
        noParent: function(assert) {
            var isRelated = repositoryUtil.isParentRelated(repository, {stuff: "stuff"}, "id");
            assert.equals(isRelated, false);
            assert.done();
        },

        isNot: function(assert) {
            var isRelated = repositoryUtil.isParentRelated(repositoryWithParent, {stuff: "stuff", idParent: "another"}, "id");
            assert.equals(isRelated, false);
            assert.done();
        },

        is: function(assert) {
            var isRelated = repositoryUtil.isParentRelated(repositoryWithParent, {stuff: "stuff", idParent: "id"}, "id");
            assert.equals(isRelated, true);
            assert.done();
        }
    },

    getParentData: function(assert) {
        var parentData = {stuff: "stuff", idParent: "parent"};
        repository.add(parentData, function() {
            repositoryUtil.getParentData(repositoryWithParent, function (data) {
                assert.same(data, parentData);
                assert.done();
            }, {idParent: "parent"});
        });
    },

    createParentData: function(assert) {
        var parentObject = {idParent: "test"};
        repositoryUtil.createParentData(repositoryWithParent, function() {
            repository.get("test", function (data) {
                assert.same(data, parentObject);
                assert.done();
            });
        }, parentObject);
    },

    createEmptyParentData: function(assert) {
        var emptyParent = repositoryUtil.createEmptyParentData(repositoryWithParent, "test");
        assert.same(emptyParent, {idParent: "test"});
        assert.done();
    },

    prepareParentAndChildForAdd: {
        withoutParent: function(assert) {
            var entryResource = {stuff: "stuff"};
            repositoryUtil.prepareParentAndChildForAdd(repository, entryResource, function(preparedResource) {
                assert.same(preparedResource, entryResource);
                assert.done();
            });
        },

        withParent: function(assert) {
            var entryResource = {stuff: "stuff"};
            repositoryUtil.prepareParentAndChildForAdd(repositoryWithParent, entryResource, function(preparedResource) {
                assert.same(preparedResource, {stuff: "stuff", idParent: "parent"});
                assert.done();
            }, {idParent: "parent"});
        }
    },

    addParentIdIfNotExist: function(assert) {
        var resource = repositoryUtil.addParentIdIfNotExist(repositoryWithParent, {stuff: "stuff"}, "parent");
        assert.same(resource, {stuff: "stuff", idParent: "parent"});
        assert.done();
    }
};