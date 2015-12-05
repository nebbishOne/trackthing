'use strict';

(function() {
    var env;
    
    if (process.env.TRIPS_ENV) {
        env = process.env.TRIPS_ENV;
    } else {
        env = 'test';
    }
    
    if (!(env === 'test' || env === 'dev' || env === 'production') ) {
        throw new Error('"' + env + '" is not a valid environment.');
    }
    
    module.exports = env;
}) ();
