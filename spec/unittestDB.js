'use strict';

var request = require('request');
var dbSession = require('../src/backend/dbSession.js');
var resetDatabase = require('../spec/resetDatabase.js');
var async = require('async');

async.series(
    [
        function(callback) {
            console.log('calling resetDatabase...');
            resetDatabase(dbSession, callback);
        },
        
        function(callback) {
            console.log('calling dbSession.insert 1...');
            dbSession.insert(
                'trips', 
                {'trip_name': '11/1/2015 12:00:00', 'trip_type_id': 1},
                function(err) { callback(err); }
            );
        },
        
        function(callback) {
            console.log('calling dbSession.insert 2...');
            dbSession.insert(
                'trips', 
                {'trip_name': '11/6/2015 12:00:00', 'trip_type_id': 2},
                function(err) { callback(err); }
            );
        },
        
        function(callback) {
            console.log('calling dbSession.insert 3...');
            dbSession.insert(
                'trips', 
                {'trip_name': '11/7/2015 12:00:00', 'trip_type_id': 3},
                function(err) { callback(err); }
            );
        }
    ],
    function(err, results) {
        if (err) {
            console.log('error in async.series in unittestDB :', err);
        }
    }
);
