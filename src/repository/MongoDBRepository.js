var BaseRepository = require("./BaseRepository");
var repositoryUtil = require("./repositoryUtil");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var async = require("async");

var Repository = function(dataInfo, repositoryInfo) {
    BaseRepository.call(this, dataInfo, repositoryInfo);
    this.serverUrl = repositoryInfo.mongoOptions.serverUrl;
    this.database = repositoryInfo.mongoOptions.database;
    this._createMongoUri();
};

Repository.prototype = Object.create(BaseRepository.prototype);

Repository.prototype.get = function(resourceId, callback, additionalIdentifiers) {
    var self = this;
    this._connect(function(collection, closeCallback) {
        var filter = self._createFilter(resourceId, additionalIdentifiers);
        collection.findOne(filter, function(err, document) {
            if(err) throw err;
            callback(document);
            closeCallback();
        });
    });
};

Repository.prototype.getAll = function(callback, additionalIdentifiers) {
    var self = this;
    this._connect(function(collection, closeCallback) {
        var filter = self._createFilter(null, additionalIdentifiers);
        collection.find(filter).toArray(function(err, results) {
            if(err) throw err;
            callback(results);
            closeCallback();
        });
    });
};

Repository.prototype.add = function(resource, callback, additionalIdentifiers) {
    this._save(resource, callback, additionalIdentifiers);
};

Repository.prototype.update = function(resource, callback, additionalIdentifiers) {
    this._save(resource, callback, additionalIdentifiers);
};

Repository.prototype.remove = function(resourceId, callback, additionalIdentifiers) {
    this._notifyParentDeleted(resourceId);
    var self = this;
    this._connect(function(collection, closeCallback) {
        var filter = self._createFilter(resourceId);
        collection.remove(filter, {w:1}, function(err, numberOfRemovedDocs) {
            if(err) throw err;
            callback(numberOfRemovedDocs);
            closeCallback();
        });
    });
};

Repository.prototype.removeAll = function(callback, additionalIdentifiers) {
    this._connect(function(collection, closeCallback) {
        collection.remove(function(err, numberOfRemovedDocs) {
            if(err) throw err;
            callback(numberOfRemovedDocs);
            closeCallback();
        });
    });
};

Repository.prototype.parentDeleted = function(parentId) {
    var self = this;
    this._connect(function(collection, closeCallback) {
        var filter = {};
        filter[self.parentRepository.idField] = parentId;
        collection.remove(filter, {w:1}, function(err, numberOfRemovedDocs) {
            if(err) throw err;
            closeCallback();
        });
    });
};

Repository.prototype._connect = function(callback) {
    var self = this;
    MongoClient.connect(this.mongoUri, function(err, db) {
        if(err) throw err;
        var collection = db.collection(self.dataName);
        callback(collection, function() {
            db.close();
        });
    });
};

Repository.prototype._createFilter = function(resourceId, additionalIdentifiers) {
    var filter = {};
    if(additionalIdentifiers) {
        for(var field in additionalIdentifiers) {
            filter[field] = additionalIdentifiers[field];
        }
    }

    if(resourceId)
        filter[this.idField] = resourceId;
    return filter;
};

Repository.prototype._createMongoUri = function() {
    this.mongoUri = "mongodb://" + this.serverUrl + "/" + this.database;
};

Repository.prototype._save = function(resource, callback, additionalIdentifiers) {
    var self = this;
    if(resource._id) {
        resource._id = new ObjectID(resource._id);
    }
    async.parallel([
        function(callback) {
            repositoryUtil.prepareParentAndChildForAdd(self, resource, function(preparedResource) {
                callback(null, preparedResource);
            }, additionalIdentifiers);
        },

        function(callback) {
            self._connect(function(collection, closeCallback) {
                callback(null, {collection:collection, closeCallback:closeCallback});
            });
        }
    ], function(err, results) {
        var collection = results[1].collection;
        var closeCallback = results[1].closeCallback;
        var preparedResource = results[0];
        collection.save(preparedResource, {safe:true}, function(err, records) {
            if(err) throw err;
            if(callback) callback(preparedResource);
            closeCallback();
        });
    });
};

module.exports = Repository;