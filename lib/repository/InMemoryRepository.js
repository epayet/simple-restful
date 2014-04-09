var BaseRepository = require('./BaseRepository');
var util = require('../util/util');

var Repository = function(dataInfo, repositoryInfo) {
    BaseRepository.call(this, dataInfo, repositoryInfo);
    if(repositoryInfo && repositoryInfo.defaultData)
        this.data = repositoryInfo.defaultData;
    else
        this.data = [];
};

Repository.prototype = Object.create(BaseRepository.prototype);

Repository.prototype.get = function(resourceId, callback, additionalIdentifiers) {
    var parentId = this._getParentId(additionalIdentifiers);
    var dataIndex = this._getDataIndex(resourceId, parentId);
    var resource = util.copy(this.data[dataIndex]);
    callback(resource);
};

Repository.prototype.getAll = function(callback, additionalIdentifiers) {
    var parentId = this._getParentId(additionalIdentifiers);
    var self = this;
    this._getData(parentId, function(data) {
        if(!data)
            callback([]);
        else {
            var filteredData = self._applyFilters(data, additionalIdentifiers);
            callback(filteredData);
        }
    });
};

Repository.prototype.update = function(resource, callback, additionalIdentifiers) {
    var parentId = this._getParentId(additionalIdentifiers);
    var dataIndex = this._getDataIndexFromResource(resource, parentId);
    this.data[dataIndex] = resource;
    callback(resource);
};

Repository.prototype.add = function(resource, callback, additionalIdentifiers) {
    var self = this;
    this._prepareParentAndChildForAdd(resource, function(preparedResource) {
        self.data.push(preparedResource);
        callback(preparedResource);
    }, additionalIdentifiers);
};

Repository.prototype.remove = function(resourceId, callback, additionalIdentifiers) {
    this._notifyParentDeleted(resourceId);
    var parentId = this._getParentId(additionalIdentifiers);
    this._deleteFromData(resourceId, parentId);
    callback();
};

Repository.prototype.parentDeleted = function(parentId) {
    var self = this;
    this._getData(parentId, function(dataFromParent) {
        for(var i=0; i<dataFromParent.length; i++) {
            var resourceId = self._getResourceId(dataFromParent[i]);
            self._deleteFromData(resourceId, parentId);
        }
    });
};

Repository.prototype._getData = function(parentId, callback) {
    var self = this;
    if(this._hasParent()) {
        this._parentExists(parentId, function(parentExists) {
            if(parentExists) {
                var data = [];
                for(var i=0; i<self.data.length; i++) {
                    if(self._isParentRelated(self.data[i], parentId))
                        data.push(self.data[i]);
                }
                callback(data);
            }
            else
                callback(null);
        });
    }
    else
        callback(this.data);
};

Repository.prototype._getDataIndex = function(resourceId, parentId) {
    for(var i=0; i<this.data.length; i++) {
        if(resourceId == this.data[i][this.idField]) {
            if((this._isParentRelated(this.data[i], parentId)) || !this._hasParent())
                return i;
        }
    }
    return null;
};

Repository.prototype._getDataIndexFromResource = function(resource, parentId) {
    var id = this._getResourceId(resource);
    return this._getDataIndex(id, parentId);
};

Repository.prototype._deleteFromData = function(resourceId, parentId) {
    var dataIndex = this._getDataIndex(resourceId, parentId);
    this.data.splice(dataIndex, 1);
};

module.exports = Repository;