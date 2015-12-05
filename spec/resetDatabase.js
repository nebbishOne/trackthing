'use strict';

var async = require('async');
var env = require('../src/backend/env.js');
var dbOptions = require('../database.json')[env];

var resetDatabase = function(dbSession, callback) {
    if (dbOptions.driver === 'sqlite3') {
        async.series(
            [
                function(callback) {
                    dbSession.remove('trips', '1', function(err) {
                        callback(err);
                    });
                },
                
                function(callback) {
                    dbSession.remove('triptypes', '1', function(err) {
                        callback(err);
                    });
                },
                
                function(callback) {
                    dbSession.remove('sqlite_sequence', '1', function(err) {
                        callback(err, null);
                    });
                }
            ],
            function(err, results) {
                callback(err);
            }
        );
    }
    
    if (dbOptions.driver === 'mysql') {
        async.series(
            [
                function(callback) {
                    dbSession.remove('TRUNCATE trips', [], function(err) {
                        callback(err);
                    });
                },
                
                function(callback) {
                    dbSession.remove('TRUNCATE triptypes', [], function(err) {
                        callback(err);
                    });
                },
            ],
            function(err, results) {
                callback(err);
            }
        );
    }
};

module.exports = resetDatabase;
