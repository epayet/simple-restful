var async = require("async");

var simpleDataInfo = {
    idField: "id",
    name: "simple"
};
var masterDataInfo = {
    idField: "idMaster",
    name: "master"
};
var noIdFieldDataInfo = {
    name: "noIdField"
};

var simpleRepository, repositoryWithSubRepository, subRepository, noIdFieldRepository;

function runRepositoryTest(Repository, options) {
    beforeEach(function () {
        simpleRepository = new Repository(simpleDataInfo, options);
        repositoryWithSubRepository = new Repository(masterDataInfo, options);
        subRepository = new Repository(simpleDataInfo, options);
        repositoryWithSubRepository.addSubRepository(subRepository);
        noIdFieldRepository = new Repository(noIdFieldDataInfo, options);
    });

    afterEach(function (done) {
        var callbacks = [];
        callbacks.push(createRemoveAllCallback(simpleRepository));
        callbacks.push(createRemoveAllCallback(repositoryWithSubRepository));
        callbacks.push(createRemoveAllCallback(subRepository));
        callbacks.push(createRemoveAllCallback(noIdFieldRepository));

        async.parallel(callbacks, function () {
            done();
        });

        function createRemoveAllCallback(repository) {
            return function(callback) {
                repository.removeAll(callback);
            };
        }
    });

    describe("test", function () {
        describe("initialization", function () {
            it("should be initialized", function () {
                expect(simpleRepository).toBeDefined();
                expect(repositoryWithSubRepository).toBeDefined();
                expect(subRepository).toBeDefined();
                expect(noIdFieldRepository).toBeDefined();
            });
        });

        describe("simpleResource", function () {
            it("should getAll empty", function (done) {
                simpleRepository.getAll(function(resources) {
                    expect(resources).toEqual([]);
                    done();
                });
            });

            it("should add simple data", function (done) {
                injectSimpleData(simpleRepository, 1, function(simple) {
                    simpleRepository.get(1, function(obj) {
                        expect(obj).toEqual(simple);
                        done();
                    });
                });
            });

            it("should getAll with 3 data", function (done) {
                injectSimpleData(simpleRepository, 3, function() {
                    simpleRepository.getAll(function(resources) {
                        expect(resources.length).toBe(3);
                        done();
                    });
                });
            });

            it("should getMultiple", function (done) {
                injectSimpleData(simpleRepository, 3, function(simpleData) {
                    simpleRepository.getMultiple([1, 2, 3], function(resources) {
                        expect(resources.length).toBe(3);
                        expect(resources).toEqual(simpleData);
                        done();
                    });
                });
            });

            it("should delete one", function (done) {
                injectSimpleData(simpleRepository, 2, function(simpleData) {
                    simpleRepository.remove(2, function() {
                        simpleRepository.getAll(function(resources) {
                            expect(resources.length).toBe(1);
                            expect(resources[0]).toEqual(simpleData[0]);
                            done();
                        });
                    });
                });
            });

            it("should update a data", function (done) {
                injectSimpleData(simpleRepository, 1, function(simple) {
                    simple.test = "test";
                    simpleRepository.update(simple, function() {
                        simpleRepository.get(simple.id, function(obj) {
                            expect(obj).toEqual(simple);
                            done();
                        });
                    });
                });
            });
        });

        describe("sub resource", function () {
            it("should get all empty", function (done) {
                repositoryWithSubRepository.getAll(function(resources) {
                    expect(resources.length).toBe(0);
                    done();
                });
            });

            it("should add a sub resource, then the parent is created", function (done) {
                var parentId = 1;
                var additionalIdentifiers = {
                    idMaster : parentId
                };
                injectSimpleData(subRepository, 1, function(simple) {
                    subRepository.get(simple.id, function(resource) {
                        expect(resource).toEqual(simple);

                        repositoryWithSubRepository.get(parentId, function(parentResourceCreated) {
                            expect(parentResourceCreated).not.toEqual(null);
                            expect(parentResourceCreated.idMaster).toBe(parentId);
                            done();
                        });
                    }, additionalIdentifiers);
                }, additionalIdentifiers);
            });

            it("should remove sub resource and parent exists", function (done) {
                var parentId = 1;
                var additionalIdentifiers = {
                    idMaster : parentId
                };
                injectSimpleData(subRepository, 2, function(simpleData) {
                    subRepository.remove(simpleData[0].id, function() {
                        subRepository.getAll(function(resources) {
                            expect(resources.length).toBe(1);
                            expect(resources[0]).toEqual(simpleData[1]);

                            subRepository.remove(simpleData[1].id, function() {
                                subRepository.getAll(function(resources) {
                                    expect(resources.length).toBe(0);
                                    repositoryWithSubRepository.get(parentId, function(parent) {
                                        expect(parent.idMaster).toBe(parentId);
                                        done();
                                    });
                                }, additionalIdentifiers);
                            }, additionalIdentifiers);
                        }, additionalIdentifiers);
                    }, additionalIdentifiers);
                }, additionalIdentifiers);
            });

            it("should remove the parent and sub resource died", function (done) {
                var parentId1 = 1;
                var additionalIdentifiers1 = {idMaster : parentId1};
                var parentId2 = 2;
                var additionalIdentifiers2 = {idMaster : parentId2};

                injectSimpleData(subRepository, 2, function() {
                    injectSimpleData(subRepository, 1, function() {
                        repositoryWithSubRepository.remove(parentId2, function() {
                            repositoryWithSubRepository.get(parentId2, function(deletedParent) {
                                expect(deletedParent).toBeFalsy();

                                subRepository.getAll(function(childResourceSurvivor) {
                                    expect(childResourceSurvivor.length).toBe(2);

                                    subRepository.getAll(function(supposedlyDeadChild) {
                                        expect(supposedlyDeadChild).toEqual([]);
                                        done();
                                    }, additionalIdentifiers2);
                                }, additionalIdentifiers1);
                            });
                        });
                    }, additionalIdentifiers2);
                }, additionalIdentifiers1);
            });
        });

        //TODO does not work with File
        //TODO noIdField: means no add method, only update and {} by default
        describe("no id field", function () {
            it("should add one and return one object", function (done) {
                injectSimpleData(noIdFieldRepository, 1, function(simple) {
                    noIdFieldRepository.get(null, function(data) {
                        expect(data).toEqual(simple);
                        done();
                    });
                });
            });
        });

        //TODO does not work with File
        describe("filters", function () {
            it("should filter the result", function (done) {
                injectSimpleData(simpleRepository, 2, function(simple) {
                    var randomField = "data2";
                    var additionalIdentifiers = {randomField : randomField};
                    simpleRepository.getAll(function(objs) {
                        expect(objs.length).toBe(1);
                        expect(objs[0].randomField).toBe(randomField);
                        done();
                    }, additionalIdentifiers);
                });
            });
        });
    });
}

function injectSimpleData(repository, nbData, callback, additionalIdentifiers) {
    //if a lot of data to inject, callback an array
    if(nbData > 1) {
        var createCallbacks = [];
        for (var i = 1; i <= nbData; i++) {
            createCallbacks.push(createAddCallback(i));
        }
        async.parallel(createCallbacks, function (err, results) {
            callback(results);
        });
    } //else callback only one object and call it now
    else {
        createAddCallback(1)(function (err, result) {
            callback(result);
        });
    }

    function createAddCallback(nbData) {
        var simple = {
            id: nbData,
            randomField : "data" + nbData
        };
        return function(callback) {
            repository.add(simple, function(simple) {
                callback(null, simple);
            }, additionalIdentifiers);
        }
    }
}

exports.runRepositoryTest = runRepositoryTest;