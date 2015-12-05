'use strict';

var request = require('request');
var dbSession = require('../../src/backend/dbSession.js');
var Server = require('../../src/backend/server.js').Server;
var resetDatabase = require('../../spec/resetDatabase.js');
var async = require('async');
 
describe('The API', function() {
    
    var server;
    
    beforeEach(function (done) {
        server = Server('8081');
        server.listen(function(err) {
            resetDatabase(dbSession, function() {
                console.log('reset done inside beforeEach.');
                done(err);
            });
        });
    });
    
    afterEach(function (done) {
        server.close(function () {
            resetDatabase(dbSession, function() {
                console.log('reset done inside afterEach.');
                done();
            });
        });    
    });
    
    it('should respond to a GET request at /api/list_trips', function(done) {
        var expected = {
            "_items": [
                {'id': 1, 'tripname': '11/1/2015 12:00:00', 'triptypeid': 1},
                {'id': 2, 'tripname': '11/6/2015 12:00:00', 'triptypeid': 2},
                {'id': 3, 'tripname': '11/7/2015 12:00:00', 'triptypeid': 3}
            ]
        };
        
        async.series(
            [
                function(callback) {
                    dbSession.insert(
                        'trips', 
                        {'tripname': '11/1/2015 12:00:00', 'triptypeid': 1},
                        function(err) { callback(err); }
                    );
                },
                
                function(callback) {
                    dbSession.insert(
                        'trips', 
                        {'tripname': '11/6/2015 12:00:00', 'triptypeid': 2},
                        function(err) { callback(err); }
                    );
                },
                
                function(callback) {
                    dbSession.insert(
                        'trips', 
                        {'tripname': '11/7/2015 12:00:00', 'triptypeid': 3},
                        function(err) { callback(err); }
                    );
                }
            ],
            
            function(err, results) {
                if (err) throw(err);
                
                request.get(
                    {
                        'url': 'http://localhost:8081/api/list_trips',
                        'json': true
                    },
                    function(err, res, body) {
                        expect(res.statusCode).toBe(200);
                        expect(body).toEqual(expected);
                        done();
                    }
                );
            }
        );
    });
    
    it('should respond to a GET request at /api/list_trips/list_triptypes', function(done) {
        var expected = {
            "_items": [
                {'id': 1, 'triptypename': 'Walking'}, 
                {'id': 2, 'triptypename': 'Cycling'},
                {'id': 3, 'triptypename': 'Driving'}
            ]
        };
        
        async.series(
            [
                function(callback) {
                    resetDatabase(dbSession, callback);
                },
                
                function(callback) {
                    dbSession.insert(
                        'triptypes',
                        {'triptypename': 'Walking'},
                        function(err) { callback(err) });
                },
                
                function(callback) {
                    dbSession.insert(
                        'triptypes',
                        {'triptypename': 'Cycling'},
                        function(err) { callback(err) });
                },
                
                function(callback) {
                    dbSession.insert(
                        'triptypes',
                        {'triptypename': 'Driving'},
                        function(err) { callback(err) });
                }
            ],
            
            function(err, results) {
                if (err) throw (err);
                
                request.get(
                    {
                        'url': 'http://localhost:8081/api/list_trips/list_triptypes',
                        'json': true
                    },
                    function(err, res, body) {
                        expect(res.statusCode).toBe(200);
                        expect(body).toEqual(expected);
                        done();
                    }
                );
            }
        );
    });
});
