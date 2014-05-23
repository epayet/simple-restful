var _ = require("underscore");

var Server = function () {
    this.isRunning = false;
};

Server.prototype.listen = function(port, callback) {

};

Server.prototype.close = function() {

};

Server.prototype.get = function(uri, callback) {

};

Server.prototype.post = function(uri, callback) {

};

Server.prototype.put = function(uri, callback) {

};

Server.prototype.del = function(uri, callback) {

};

Server.prototype.addRoute = function(infos) {
    switch(infos.verb) {
        case "GET":
            this.get(infos.uri, execute);
            break;
    }

    function execute(req, res) {
        if (infos.debug)
            console.log("%s %s", infos.verb, req.url);

        //additionalIdentifiers is the merge with req.params and req.query, careful : may overwrite one or the other
        var additionalIdentifiers = _.extend(req.params, req.query);
        //req.params[infos.idField]
        infos.callback(function (resource) {
            if (resource != null)
                res.send(resource);
            else
                res.send(204);
        }, additionalIdentifiers);
    }
};

module.exports = Server;