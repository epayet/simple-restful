var restify = require('restify');
var RestServer = require('./modules/server/RestServer');
var ResourceManager = require('./modules/server/ResourceManager');

var testExamples = getResourceTestData("example");
var testSubExamples= getResourceTestData("sub");

module.exports = {
    setUp: function(callback) {
        this.server = setUpServer();
        this.client = restify.createJsonClient({
            url: 'http://localhost:8081'
        });
        callback();
    },

    tearDown : function(callback) {
        this.server.close();
        this.client.close();
        callback();
    }
    //TODO
    /*groupExample : {
        getAllEmptyQueries : function(test){
            this.client.get('/query', function(err, req, res, obj) {
                test.ok(obj != null);
                test.equals(obj.length, 0);
                test.done();
            });
        },

        addQuery : function(test) {
            this.client.post('/query', testQueries[0], function(err, req, res, obj) {
                test.equals(obj.toString(), testQueries[0].toString());
            });
            this.client.get("/query/query1", function(err, req, res, obj) {
                test.ok(obj != null);
                test.same(obj, testQueries[0]);
                test.done();
            });
        },

        updateQueryWithOneAdd : function(test) {
            this.client.post('/query', testQueries[0], function(err, req, res, obj) {});
            var query = testQueries[0];
            query.request = "SELECT x, y FROM test";
            this.client.post("/query/query1", query, function(err, req, res, obj) {});
            this.client.get('/query/query1', function(err, req, res, obj) {
                test.same(obj, query);
                test.done();
            });
        },

        deleteQueryWith2PreviousAddOnlyOneSurvive : function(test) {
            this.client.post("/query", testQueries[0], function(){});
            this.client.post("/query", testQueries[1], function(){});
            this.client.get("/query", function(err, req, res, obj) {
                test.equals(obj.length, 2);
            });
            this.client.del("/query/query1", function(){});
            this.client.get("/query", function(err, req, res, obj) {
                test.equals(obj.length, 1);
                test.equals(obj[0].name, testQueries[1].name);
                test.done();
            });
        }
    },

    groupReport : {
        getAllEmptyReports : function(test) {
            this.client.get("/report", function(err, req, res, obj) {
                test.ok(obj != null);
                test.equals(obj.length, 0);
                test.done();
            });
        },

        addTwoReportDate_ReportCreated : function(test) {
            //Add 1 report with 2 dates
            this.client.post("/report/report1/date", testReportDates[0], function(err, req, res, obj) {});
            this.client.post("/report/report1/date", testReportDates[1], function(err, req, res, obj) {});
            this.client.get("/report/report1/date/date1", function(err, req, res, obj) {
                test.same(obj, testReportDates[0]);
            });
            this.client.get("/report/report1/date/date2", function(err, req, res, obj) {
                test.same(obj, testReportDates[1]);
            });
            this.client.get("/report/report1", function(err, req, res, obj) {
                test.same(obj, testReports[0]);
                test.done();
            });
        },

        deleteReport_ReportDateDeleted : function(test) {
            this.client.post("/report/report1/date", testReportDates[0], function() {});
            this.client.post("/report/report1/date", testReportDates[1], function() {});
            this.client.post("/report/report2/date", testReportDates[2], function() {});
            this.client.del("/report/report1", function(err, req, res, obj){});
            this.client.get("/report/report1", function(err, req, res, obj) {
                test.equals(res.statusCode, 204);
            });
            this.client.get("/report/report1/date/date1", function(err, req, res, obj) {
                test.equals(res.statusCode, 204);
                test.done();
            });
        }
    }*/
}

function setUpServer() {
    var serverInfo = {
        port : 8081
    };
    var server = new RestServer(serverInfo);
    var resourceManager = new ResourceManager();

    var simpleResourceInfo = {
        name : "example",
        idField : "name",
        repositoryInfo: {
            repositoryType : "InMemoryRepository"
        },
        subResources : [
            {
                name : "sub",
                idField : "id",
                repositoryInfo: {
                    repositoryType : "InMemoryRepository"
                }
            }
        ]
    };
    resourceManager.addResource(simpleResourceInfo);

    resourceManager.addToServer(server);
    server.run();
    return server.server;
}

//TODO
function getResourceTestData(resource) {
    switch(resource) {
        case "query":
            return [
                {
                    name: "query1"
                },
                {
                    name: "query2"
                }
            ];
        case "report":
            return [
                {
                    name : "report1"
                },
                {
                    name : "report2"
                }
            ];
        case "reportDate":
            return [
                {
                    name : "report1",
                    date : "date1"
                },
                {
                    name : "report1",
                    date : "date2"
                },
                {
                    name : "report2",
                    date : "date1"
                }
            ];
    }
}