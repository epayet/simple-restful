var Repository = function(dataInfo, repositoryInfo) {
    this.idField = dataInfo.idField;
    this.dataName = dataInfo.name;
    this.subRepositories = [];
    this.linkedRepositories = {};
};

Repository.prototype.get = function(resourceId, callback, additionalIdentifiers) {

};

Repository.prototype.getAll = function(callback, additionalIdentifiers) {

};

Repository.prototype.add = function(resource, callback, additionalIdentifiers) {

};

Repository.prototype.update = function(resource, callback, additionalIdentifiers) {

};

Repository.prototype.remove = function(resourceId, callback, additionalIdentifiers) {

};

Repository.prototype.removeAll = function(callback, additionalIdentifiers) {
    if(callback != null)
        callback();
};

Repository.prototype.parentDeleted = function(parentId) {

};

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

Repository.prototype._getResourceId = function(resource) {
    return resource[this.idField];
};

Repository.prototype._parentExists = function(parentId, callback) {
    this.parentRepository.get(parentId, function(parent) {
        callback(parent != null);
    });
};

Repository.prototype._isParentRelated = function(resource, parentId) {
    if(this._hasParent())
        return resource[this.parentRepository.idField] == parentId;
    return false;
};

Repository.prototype._getParentId = function(additionalIdentifiers) {
    if(this._hasParent() && additionalIdentifiers != null)
        return additionalIdentifiers[this.parentRepository.idField];
    return null;
};

Repository.prototype._hasParent = function() {
    return this.parentRepository != null;
};

Repository.prototype._hasSubRepositories = function() {
    return this.subRepositories.length > 0;
};

Repository.prototype._createParentData = function(callback, additionalIdentifiers) {
    var parentId = this._getParentId(additionalIdentifiers);

    var parentData = this._createEmptyParentData(parentId);
    this.parentRepository.add(parentData, function(data) {
        callback(data);
    },additionalIdentifiers);
};

Repository.prototype._createEmptyParentData = function(parentId) {
    var parentData = {};
    parentData[this.parentRepository.idField] = parentId;
    return parentData;
};

Repository.prototype._getParentData = function(callback, additionalIdentifiers) {
    var parentId = this._getParentId(additionalIdentifiers);
    this.parentRepository.get(parentId, function(parentData) {
        callback(parentData);
    }, additionalIdentifiers)
};

Repository.prototype._notifyParentDeleted = function(resourceId) {
    if(this._hasSubRepositories()) {
        for(var i=0; i<this.subRepositories.length; i++) {
            this.subRepositories[i].parentDeleted(resourceId);
        }
    }
};

Repository.prototype._prepareParentAndChildForAdd = function(resource, callback, additionalIdentifiers) {
    var self = this;
    if(this._hasParent()) {
        var parentId = this._getParentId(additionalIdentifiers);
        this._parentExists(parentId, function(parentExists) {
            if(!parentExists) {
                self._createParentData(function(createdData) {
                    addParentIdAndCallBack(resource, parentId);
                }, additionalIdentifiers);
            }
            else
                addParentIdAndCallBack(resource, parentId);
        });
    }
    else
        callback(resource);

    function addParentIdAndCallBack(resource, parentId) {
        resource = self._addParentIdIfNotExist(resource, parentId);
        callback(resource);
    }
};

Repository.prototype._addParentIdIfNotExist = function(resource, parentId) {
    if(resource[this.parentRepository.idField] == null)
        resource[this.parentRepository.idField] = parentId;
    return resource;
};

//Dirty way to apply filters : get All data, and retrieve only wanted ones, works for every data repository
Repository.prototype._applyFilters = function(data, additionalIdentifiers) {
    if(!additionalIdentifiers) return data;
    var filteredData = [];
    var nbProperties = 0;
    for(var i=0; i<data.length; i++) {
        for(var field in additionalIdentifiers) {
            nbProperties++;
            if(data[i][field] == additionalIdentifiers[field]) {
                if(filteredData.indexOf(data[i]) < 0) //if not in
                    filteredData.push(data[i]);
            }
        }
    }
    return nbProperties ? filteredData : data;
};

module.exports = Repository;