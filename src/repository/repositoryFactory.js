function createRepository (info, options) {
    info.repositoryOptions = options;
    var repository = createRepositoryInstance(info, options);
    return {
        get: function(resourceId, callback, additionalIdentifiers) {
            repository.get(resourceId, callback, additionalIdentifiers);
        },
        getAll: function(callback, additionalIdentifiers) {
            repository.getAll(callback, additionalIdentifiers);
        },
        add: function(resource, callback, additionalIdentifiers) {
            repository.add(resource, callback, additionalIdentifiers);
        },
        update: function(resource, callback, additionalIdentifiers) {
            repository.update(resource, callback, additionalIdentifiers);
        },
        remove: function(resourceId, callback, additionalIdentifiers) {
            repository.remove(resourceId, callback, additionalIdentifiers);
        },
        info: info,
        instance: repository
    };
}

function createRepositoryInstance(info, options) {
    var RepositoryClass = require("./" + info.repository + "Repository");
    return new RepositoryClass(info, options);
}

exports.createRepository = createRepository;
exports.createRepositoryInstance = createRepositoryInstance;