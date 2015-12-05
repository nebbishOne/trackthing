'use strict';
var async = require('async');
var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
    async.series(
        [
            db.createTable.bind(db, 'trips', {
                id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
                tripname: {type: 'string', length: '128', notNull: true, unique: true },
                triptypeid: { type: 'int', notNull: true }
            }),
            
            db.createTable.bind(db, 'triptypes', {
                id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
                triptypename: {type: 'string', length: '128', notNull: true, unique: true }
            })
            
        ], callback);
};

exports.down = function(db, callback) {
    async.series(
        [
            db.dropTable.bind(db, 'trips'),
            db.dropTable.bind(db, 'triptypes')
        ], callback);
};
