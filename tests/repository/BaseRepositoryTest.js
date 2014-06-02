var async = require("async");

exports.testRepository = function(Repository, repositoryInfo) {
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

    return {
        setUp: function (callback) {
            simpleRepository = new Repository(simpleDataInfo, repositoryInfo);
            repositoryWithSubRepository = new Repository(masterDataInfo, repositoryInfo);
            subRepository = new Repository(simpleDataInfo, repositoryInfo);
            repositoryWithSubRepository.addSubRepository(subRepository);
            noIdFieldRepository = new Repository(noIdFieldDataInfo, repositoryInfo);
            callback();
        },

        tearDown: function (callback) {
            simpleRepository.removeAll(function () {
                repositoryWithSubRepository.removeAll(function () {
                    subRepository.removeAll(function () {
                        noIdFieldRepository.removeAll(function () {
                            callback();
                        });
                    });
                });
            });
        },

        groupSimpleResource : {
            getAll_Empty : function(test) {
                simpleRepository.getAll(function(resources) {
                    test.same(resources, []);
                    test.done();
                });
            },

            add : function(test) {
                injectSimpleData(simpleRepository, 1, function(simple) {
                    simpleRepository.get(1, function(obj) {
                        test.same(obj, simple);
                        test.done();
                    });
                });
            },

            getAll_WithThreeData : function(test) {
                injectSimpleData(simpleRepository, 3, function() {
                    simpleRepository.getAll(function(resources) {
                        test.equals(resources.length, 3);
                        test.done();
                    });
                });
            },

            getMultiple_WithThreeData : function(test) {
                injectSimpleData(simpleRepository, 3, function(simpleData) {
                    simpleRepository.getMultiple([1, 2, 3], function(resources) {
                        test.equals(resources.length, 3);
                        test.same(resources, simpleData);
                        test.done();
                    });
                });
            },

            deleteOne_WithTwoData_OnlyOneSurvive : function(test) {
                injectSimpleData(simpleRepository, 2, function(simpleData) {
                    simpleRepository.remove(2, function() {
                        simpleRepository.getAll(function(resources) {
                            test.equals(resources.length, 1);
                            test.same(resources[0], simpleData[0]);

                            simpleRepository.get(2, function(deadData) {
                                test.equals(deadData, null);
                                test.done();
                            });
                        });
                    });
                });
            },

            update : function(test) {
                injectSimpleData(simpleRepository, 1, function(simple) {
                    simple.test = "test";
                    simpleRepository.update(simple, function() {
                        simpleRepository.get(simple.id, function(obj) {
                            test.same(obj, simple);
                            test.done();
                        });
                    });
                });
            }
        },

        groupResourceWithSubResource : {
            getAll_Empty : function(test) {
                repositoryWithSubRepository.getAll(function(resources) {
                    test.equals(resources.length, 0);
                    test.done();
                });
            },

            addSubResource_ParentCreated : function(test) {
                var parentId = 1;
                var additionalIdentifiers = {
                    idMaster : parentId
                };
                injectSimpleData(subRepository, 1, function(simple) {
                    subRepository.get(simple.id, function(resource) {
                        test.same(resource, simple);

                        repositoryWithSubRepository.get(parentId, function(parentResourceCreated) {
                            test.ok(parentResourceCreated != null);
                            test.equals(parentResourceCreated.idMaster, parentId);
                            test.done();
                        });
                    }, additionalIdentifiers);
                }, additionalIdentifiers);
            },

            removeSubResource_ParentExists : function(test) {
                var parentId = 1;
                var additionalIdentifiers = {
                    idMaster : parentId
                };
                injectSimpleData(subRepository, 2, function(simpleData) {
                    subRepository.remove(simpleData[0].id, function() {
                        subRepository.getAll(function(resources) {
                            test.equals(resources.length, 1);
                            test.same(resources[0], simpleData[1]);

                            subRepository.remove(simpleData[1].id, function() {
                                subRepository.getAll(function(resources) {
                                    test.equals(resources.length, 0);
                                    repositoryWithSubRepository.get(parentId, function(parent) {
                                        test.equals(parent.idMaster, parentId);
                                        test.done();
                                    });
                                }, additionalIdentifiers);
                            }, additionalIdentifiers);
                        }, additionalIdentifiers);
                    }, additionalIdentifiers);
                }, additionalIdentifiers);
            },

            removeParent_SubResourcesDie : function(test) {
                var parentId1 = 1;
                var additionalIdentifiers1 = {idMaster : parentId1};
                var parentId2 = 2;
                var additionalIdentifiers2 = {idMaster : parentId2};

                injectSimpleData(subRepository, 2, function() {
                    injectSimpleData(subRepository, 1, function() {
                        repositoryWithSubRepository.remove(parentId2, function() {
                            repositoryWithSubRepository.get(parentId2, function(deletedParent) {
                                test.equals(deletedParent, null);

                                subRepository.getAll(function(childResourceSurvivor) {
                                    test.equals(childResourceSurvivor.length, 2);

                                    subRepository.getAll(function(supposedlyDeadChild) {
                                        test.same(supposedlyDeadChild, []);
                                        test.done();
                                    }, additionalIdentifiers2);
                                }, additionalIdentifiers1);
                            });
                        });
                    }, additionalIdentifiers2);
                }, additionalIdentifiers1);
            }
        },

        //TODO does not work with File
        groupNoIdField: {
            addOne_getReturnsOneObject: function (assert) {
                injectSimpleData(noIdFieldRepository, 1, function(simple) {
                    noIdFieldRepository.get(null, function(data) {
                        assert.same(data, simple);
                        assert.done();
                    });
                });
            }
        },

        //TODO does not work with File
        getWithFilter : function(assert) {
            injectSimpleData(simpleRepository, 2, function(simple) {
                var randomField = "data2";
                var additionalIdentifiers = {randomField : randomField};
                simpleRepository.getAll(function(objs) {
                    assert.equals(objs.length, 1);
                    assert.equals(objs[0].randomField, randomField);
                    assert.done();
                }, additionalIdentifiers);
            });
        }
    };

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
};