'use strict';

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var Server = function(port) {
    var server = Percolator({'port': port, 'autoLink': false, 'staticDir': __dirname + '/../frontend'});
    
    server.route('/api/list_trips', 
        {
            GET: function(req, res) {
                dbSession.fetchAll('SELECT id, tripname, triptypeid FROM trips ORDER BY id', function(err, rows) {
                    if (err) {
                        console.log('error in dbSession.fetchAll for trips in server.js : ', err);
                        res.status.internalServerError(err);
                    } else {
                        console.log('getting trips...');
                        res.collection(rows).send();
                    }
                });
            },
            
            POST: function(req, res) {
                req.onJson(function(err, newTrip) {
                    if (err) {
                        console.log('error in POST function: ', err);
                        res.status.internalServerError(err);
                    } else {
                        dbSession.query('INSERT INTO trips (tripname, triptypeid) VALUES (?, ?);', [newTrip.tripname, newTrip.triptypeid], function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status.internalServerError(err);
                            } else {
                                console.log('posting trips. result: ', result);
                                //res.object({'status': 'ok', 'id': result.insertId}).send();
                                res.object({'status': 'ok'}).send();
                            }
                        });
                    }
                });
            }
        }
    );
    
    server.route('/api/list_trips/list_triptypes', 
        {
            GET: function(req, res) {
                dbSession.fetchAll('SELECT id, triptypename FROM triptypes ORDER BY id', function(err, rows) {
                    if (err) {
                        console.log('error in dbSession.fetchAll for triptypes in server.js : ', err);
                        res.status.internalServerError(err);
                    } else {
                        console.log('getting trip types...');
                        //console.log('triptypes: ', res);
                        res.collection(rows).send();
                    }
                });
            }
        }
    );
    
    server.route('/api/list_trips/:id',
    {
      POST: function(req, res) {
        var tripId = req.uri.child();
        req.onJson(function(err, trips) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            console.log('----- tripId is ', tripId);
            dbSession.query('UPDATE trips SET tripname = ?, triptypeid = ? WHERE trips.id = ?;', [trips.tripname, trips.triptypeid, tripId], function (err, result) {
              if (err) {
                console.log('error occurred updating trips: ', err);
                res.status.internalServerError(err);
              } else {
                console.log('updating trip ids...');
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var tripId = req.uri.child();
        dbSession.query('DELETE FROM trips WHERE trips.id = ?;', [tripId], function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            console.log('deleting trip ids...', tripId);
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );

    return server;
};

module.exports = {'Server': Server};