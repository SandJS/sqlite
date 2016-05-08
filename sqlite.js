"use strict";

const SandGrain = require('sand-grain');
const sqlite3 = require('sqlite3');

class SQLite extends SandGrain {

  constructor() {
    super();
    this.name = 'sqlite';
    this.configName = 'sqlite';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('./package').version;
    this.sqlite3 = sqlite3;
  }

  init(config, done) {
    super.init(config);

    this.newClient()
      .then(client => {
        this.db = client;
        // this.config.init(client, done);
        done();
      })
      .catch(err => done)
  }

  shutdown(done) {
    if (!this.db) {
      done();
    } else {
      this.db.close(done);
    }
  }

  query(query, params) {
    return new Promise((resolve, reject) => {

      if (/^select/i.test(query)) {
        this.db.all(query, params, (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });

      } else {
        this.db.run(query, params, function(err) {
          if (err) {
            return reject(err);
          }
          resolve(this);
        });
      }
    });
  }

  selectOne(query, params) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    })
  }

  newClient(config) {
    config = config || {};
    return new Promise((resolve, reject) => {
      let db;

      let filename = config.filename || this.config.filename;
      let mode = config.mode || this.config.mode;
      let init = config.init || this.config.init;

      if (filename) {
        db = new sqlite3.Database(filename, callback);

      } else if (filename && 'undefined' !== typeof mode) {
        db = new sqlite3.Database(filename, mode, callback);

      } else {
        throw new Error('Invalid config');
      }

      function callback(err) {
        if (err) {
          return reject(err);
        }
        if ('function' == typeof init) {
          init(db, (err) => {
            if (err) {
              return reject(err);
            }
            resolve(db);
          });
        } else {
          resolve(db);
        }
      }
    });
  }

}

module.exports = SQLite;