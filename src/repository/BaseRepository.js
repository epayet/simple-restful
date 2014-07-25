var async = require("async");

var Repository = function(dataInfo, repositoryInfo) {
    if(dataInfo) {
        this.idField = dataInfo.idField;
        this.dataName = dataInfo.name;
    }
    this.subRepositories = [];
};

Repository.prototype.get = function(resourceId, callback, additionalIdentifiers) {
    if(callback != null)
        callback();
};

Repository.prototype.getAll = function(callback, additionalIdentifiers) {
    if(callback != null)
        callback();
};

Repository.prototype.add = function(resource, callback, additionalIdentifiers) {
    if(callback != null)
        callback(resource);
};

Repository.prototype.update = function(resource, callback, additionalIdentifiers) {
    if(callback != null)
        callback(resource);
};

Repository.prototype.remove = function(resourceId, callback, additionalIdentifiers) {
    if(callback != null)
        callback();
};

Repository.prototype.removeAll = function(callback, additionalIdentifiers) {
    if(callback != null)
        callback();
};

Repository.prototype.parentDeleted = function(parentId) {

};

Repository.prototype.getMultiple = function(resourceIds, callback, additionalIdentifiers) {
    var self = this;
    var getCallbacks = [];
    for(var i=0; i<resourceIds.length; i++) {
        getCallbacks.push(createGetCallback(resourceIds[i]));
    }

    async.parallel(getCallbacks, function (err, results) {
        callback(results);
    });

    function createGetCallback(id) {
        return function (callback) {
            self.get(id, function (resource) {
                callback(null, resource);
            }, additionalIdentifiers);
        };
    }
};

Repository.prototype.addSubRepository = function(subRepository) {
    subRepository.parentRepository = this;
    this.subRepositories.push(subRepository);
};

Repository.prototype.hasParent = function() {
    return this.parentRepository != null;
};

Repository.prototype.hasSubRepositories = function() {
    return this.subRepositories.length > 0;
};

Repository.prototype._notifyParentDeleted = function(resourceId) {
    if(this.hasSubRepositories()) {
        for(var i=0; i<this.subRepositories.length; i++) {
            this.subRepositories[i].parentDeleted(resourceId);
        }
    }
};

module.exports = Repository;