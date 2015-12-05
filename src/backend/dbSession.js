'use strict';

var env = require('./env.js');
var dbOptions = require('../../database.json')[env];
var DBWrapper = require('node-dbi').DBWrapper;

//console.log('about to create new DBWrapper...');

var dbWrapper;
if (dbOptions.driver === 'sqlite3') {
    var dbWrapper = new DBWrapper(
        'sqlite3', 
        {'path': dbOptions.filename});
} else if (dbOptions.driver === 'mysql') {
    dbWrapper = new DBWrapper('mysql', {
        'host': dbOptions.host,
        'user': dbOptions.user,
        'password': dbOptions.password,
        'database': dbOptions.database
    });
} else {
    throw (new Error('No suitable database config found.'));
}

//console.log('About to connect to the DB...');
dbWrapper.connect();

module.exports = dbWrapper;
