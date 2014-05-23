var Repository = function(dataInfo, repositoryInfo) {
    this.idField = dataInfo.idField;
    this.dataName = dataInfo.name;
    this.subRepositories = [];
    this.linkedRepositories = {};
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

//TODO maybe refacto here ? Use something like async
Repository.prototype.getMultiple = function(resourceIds, callback, additionalIdentifiers, index) {
    if(!resourceIds)
        callback(null);
    else if(resourceIds.length == 0)
        callback([]);
    else {
        var maxIndex = resourceIds.length - 1;
        if(index == null)
            index = maxIndex;

        var self = this;
        if(index != 0) {
            this.getMultiple(resourceIds, function(resources) {
                getActualAndPushToResourcesThenCallback(resources);
            }, additionalIdentifiers, index - 1);
        } else {
            getActualAndPushToResourcesThenCallback();
        }
    }

    function getActualAndPushToResourcesThenCallback(resources) {
        if(!resources)
            resources = [];

        self.get(resourceIds[index], function(resource) {
            resources.push(resource);
            callback(resources);
        }, additionalIdentifiers);
    }
};

Repository.prototype.addSubRepository = function(subRepository) {
    subRepository.parentRepository = this;
    this.subRepositories.push(subRepository);
};

Repository.prototype.addLinkedRepository = function(repositoryName, repository) {
    this.linkedRepositories[repositoryName] = repository;
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