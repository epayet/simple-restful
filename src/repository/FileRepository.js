var BaseRepository = require('./BaseRepository');
var repositoryUtil = require("./repositoryUtil");
var fs = require('fs');
var path = require("path");

var Repository = function(dataInfo, repositoryInfo) {
    BaseRepository.call(this, dataInfo, repositoryInfo);
    this.extension = ".json";
    this.folderPath = repositoryInfo.folderPath;
};

Repository.prototype = Object.create(BaseRepository.prototype);

Repository.prototype.get = function(resourceId, callback, additionalIdentifiers) {
    this._getFilePath(resourceId, additionalIdentifiers, function(filePath) {
        fs.exists(filePath, function(exists) {
            if(exists) {
                fs.readFile(filePath, function(err, data) {
                    if(err) throw err;
                    var resource = JSON.parse(data);
                    callback(resource);
                });
            } else
                callback(null);
        });
    });
};

Repository.prototype.getAll = function(callback, additionalIdentifiers) {
    var self = this;
    this._getFolderPath(additionalIdentifiers, function(folderPath) {
        fs.readdir(folderPath, function(err, files) {
            var resourceNames = [];
            for (var i = 0; i < files.length; i++) {
                //get rid of the extension
                var resourceName = getRidOfExtension(files[i]);
                resourceNames[i] = resourceName;
            }

            self.getMultiple(resourceNames, function(resources) {
                callback(resources);
            }, additionalIdentifiers);
        });
    });
};

Repository.prototype.update = function(resource, callback, additionalIdentifiers) {
    this._saveResource(resource, function() {
        callback(resource);
    }, additionalIdentifiers);
};

Repository.prototype.add = function(resource, callback, additionalIdentifiers) {
    this._saveResource(resource, function() {
        callback(resource);
    }, additionalIdentifiers);
};

Repository.prototype.remove = function(resourceId, callback, additionalIdentifiers) {
    this._getFilePath(resourceId, additionalIdentifiers, function(filePath) {
        fs.unlink(filePath, function(err) {
            if(err) throw err;

            var childFolderPath = filePath.substr(0, filePath.length - 5);
            fs.exists(childFolderPath, function(exists) {
                if(exists)
                    removeDirRecursive(childFolderPath);
                callback();
            });
        });
    });
};

Repository.prototype.removeAll = function(callback, additionalIdentifiers) {
    if(this.hasParent() && additionalIdentifiers == null)
        callback();
    else {
        this._getFolderPath(additionalIdentifiers, function(folderPath) {
            removeDirRecursive(folderPath);
            callback();
        });
    }
};

//private functions
Repository.prototype._saveResource = function(resource, callback, additionalIdentifiers) {
    var resourceId = repositoryUtil.getResourceId(this, resource);
    this._getFilePath(resourceId, additionalIdentifiers, function(filePath) {
        var dataString = JSON.stringify(resource);
        fs.writeFile(filePath, dataString, function(err) {
            if(err) throw err;
            callback();
        });
    });
};

Repository.prototype._getFilePath = function(resourceId, additionalIdentifiers, callback) {
    var self = this;
    this._getFolderPath(additionalIdentifiers, function(folderPath) {
        callback(folderPath + "/" + resourceId + self.extension);
    });
};

Repository.prototype._getFolderPath = function(additionalIdentifiers, callback) {
    var dataFolderPath = this._getDataFolderPath();
    var self = this;
    this._getParentFolderPath(additionalIdentifiers, function(parentDataFolderPath) {
        var folderPath = dataFolderPath + parentDataFolderPath +  "/" + self.dataName;
        self._createFolderIfNotExists(folderPath, function() {
            callback(folderPath);
        });
    });
};

//TODO : here works only if there is one parent, if parent has parent as well, doesn't work
Repository.prototype._getParentFolderPath = function(additionalIdentifiers, callback) {
    var parentId = repositoryUtil.getParentId(this, additionalIdentifiers);
    if(parentId == null)
        callback("");
    else {
        var self = this;
        this._createParentFoldersIfNotExists(parentId, function() {
            repositoryUtil.createParentData(self, function() {
                var parentFolder = "/" + self.parentRepository.dataName + "/" + parentId;
                callback(parentFolder);
            }, additionalIdentifiers);
        });
    }
};

Repository.prototype._createParentFoldersIfNotExists = function(parentId, callback) {
    var dataFolderPath = this._getDataFolderPath();
    var parentFolderPath = dataFolderPath + "/" + this.parentRepository.dataName;
    var self = this;
    this._createFolderIfNotExists(parentFolderPath, function() {
        var parentIdFolderPath = parentFolderPath + "/" + parentId;
        self._createFolderIfNotExists(parentIdFolderPath, function() {
            callback();
        });
    });
};

Repository.prototype._createFolderIfNotExists = function(folderPath, callback) {
    fs.exists(folderPath, function(exists) {
        if(!exists) {
            fs.mkdir(folderPath, function(err) {
                if(err) throw err;
                callback();
            });
        } else
            callback();
    });
};

Repository.prototype._getDataFolderPath = function() {
    return this.folderPath;
};

var removeDirRecursive = function(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            removeDirRecursive(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

function getRidOfExtension(fileName) {
    return fileName.split(".")[0];
}

module.exports = Repository;