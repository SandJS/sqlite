"use strict";

const sqlite3 = require('sqlite3');

class DB {
  constructor(db, config) {
    this.db = db;
    this.config = config;
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

  close() {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    })
  }

  static newInstance(config) {
    config = config || {};
    return new Promise((resolve, reject) => {
      let db;

      let filename = config.filename;
      let mode = config.mode;
      let init = config.init;

      if (filename) {
        db = new sqlite3.Database(filename, callback);

      } else if (filename && 'undefined' !== typeof mode) {
        db = new sqlite3.Database(filename, mode, callback);

      } else {
        throw new Error('Invalid config');
      }

      db = new DB(db);

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

module.exports = DB;