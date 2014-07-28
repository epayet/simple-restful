function createRepository (infos, options) {
    var RepositoryClass = require("./" + infos.repository + "Repository");
    return new RepositoryClass(infos, options);
}

exports.createRepository = createRepository;