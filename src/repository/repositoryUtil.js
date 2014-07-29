function getResourceId(repository, resource) {
    return resource[repository.idField];
}

function getParentId(repository, additionalIdentifiers) {
    if(repository.hasParent() && additionalIdentifiers != null)
        return additionalIdentifiers[repository.parentRepository.idField];
    return null;
}

function parentExists(repository, parentId, callback) {
    repository.parentRepository.get(parentId, function(parent) {
        callback(parent != null);
    });
}

function isParentRelated(repository, resource, parentId) {
    if(repository.hasParent())
        return resource[repository.parentRepository.idField] == parentId;
    return false;
}

function getParentData(repository, callback, additionalIdentifiers) {
    var parentId = getParentId(repository, additionalIdentifiers);
    repository.parentRepository.get(parentId, function(parentData) {
        callback(parentData);
    }, additionalIdentifiers)
}

function createParentData(repository, callback, additionalIdentifiers) {
    var parentId = getParentId(repository, additionalIdentifiers);
    var parentData = createEmptyParentData(repository, parentId);
    repository.parentRepository.add(parentData, function(data) {
        callback(data);
    }, additionalIdentifiers);
}

function createEmptyParentData(repository, parentId) {
    var parentData = {};
    parentData[repository.parentRepository.idField] = parentId;
    return parentData;
}

function prepareParentAndChildForAdd(repository, resource, callback, additionalIdentifiers) {
    if(repository.hasParent()) {
        var parentId = getParentId(repository, additionalIdentifiers);
        parentExists(repository, parentId, function(parentExists) {
            if(!parentExists) {
                createParentData(repository, function(createdData) {
                    addParentIdAndCallBack(resource, parentId);
                }, additionalIdentifiers);
            }
            else
                addParentIdAndCallBack(resource, parentId);
        });
    } else
        callback(resource);

    function addParentIdAndCallBack(resource, parentId) {
        resource = addParentIdIfNotExist(repository, resource, parentId);
        callback(resource);
    }
}

function addParentIdIfNotExist(repository, resource, parentId) {
    if(resource[repository.parentRepository.idField] == null)
        resource[repository.parentRepository.idField] = parentId;
    return resource;
}

//Dirty way to apply filters : get All data, and retrieve only wanted ones, works for every data repository
function applyFilters(data, additionalIdentifiers) {
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
}

exports.getResourceId = getResourceId;
exports.getParentId = getParentId;
exports.parentExists = parentExists;
exports.isParentRelated = isParentRelated;
exports.createParentData = createParentData;
exports.createEmptyParentData = createEmptyParentData;
exports.getParentData = getParentData;
exports.prepareParentAndChildForAdd = prepareParentAndChildForAdd;
exports.addParentIdIfNotExist = addParentIdIfNotExist;
exports.applyFilters = applyFilters;