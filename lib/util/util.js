var fs = require("fs");

var copy = function(obj) {
    switch(typeof obj) {
        default:
            return obj;
        case "object":
            if(Array.isArray(obj)) {
                return obj.slice(0);
            } else {
                var obj2 = {};
                for (var attr in obj) {
                    obj2[attr] = copy(obj[attr]);
                }
                return obj2;
            }
    }
};

var mergeObjects = function(obj1, obj2) {
    for (var attrname in obj2) {
        obj1[attrname] = obj2[attrname];
    }
    return obj1;
};

var trimSpacesAndBreaks = function(str) {
    str = str.replace(/(\r\n|\n|\r)/gm,"");
    str = str.trim();
    return str;
};

var stringFullTrim = function(inputText){
    return inputText.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/gm,'').replace(/\s+/gm,' ');
};

var loadJsonData = function(filePath) {
    var data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

var loadStrData = function(filePath, trim) {
    var data = fs.readFileSync(filePath, "utf-8");
    if(trim) {
        data = stringFullTrim(data);
    }
    return data;
};

var getRidOfExtension = function(fileName) {
    return fileName.split(".")[0];
};

var strArrayContains = function(str, array) {
    return array.indexOf(str) > -1;
};

var strToJsonByContentType = function(str, contentType) {
    var value = null;
    switch(contentType) {
        default:
            switch(guessType(str)) {
                case "json":
                    return strToJsonByContentType(str, "application/json");
                case "xml":
                    return strToJsonByContentType(str, "text/xml");
            }
        case "application/json":
            try{
                value = JSON.parse(str);
            } catch(err) {
                value = null;
            }
            break;

        case "text/xml":
        case "application/xml":
            var xml2json = require("xml2json");
            value = xml2json.toJson(str, {object: true});
            break;
    }
    return value;
};

var guessType = function(str) {
    var firstChar = str.substr(0, 1);
    switch(firstChar) {
        case "[":
        case "{":
            return "json";
        case "<":
            return "xml";
    }
};

exports.copy = copy;
exports.mergeObjects = mergeObjects;
exports.trimSpacesAndBreaks = trimSpacesAndBreaks;
exports.loadJsonData = loadJsonData;
exports.getRidOfExtension = getRidOfExtension;
exports.strArrayContains = strArrayContains;
exports.loadStrData = loadStrData;
exports.stringFullTrim = stringFullTrim;
exports.strToJsonByContentType = strToJsonByContentType;
exports.guessType = guessType;