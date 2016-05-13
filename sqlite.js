"use strict";

const SandGrain = require('sand-grain');
const sqlite3 = require('sqlite3');
const _ = require('lodash');
const DB = require('./db');

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
      .catch(done)
  }

  shutdown(done) {
    if (!this.db) {
      done();
    } else {
      this.db.close()
        .then(done)
        .catch(done);
    }
  }

  query(query, params) {
    return this.db.query(query, params);
  }

  selectOne(query, params) {
    return this.db.selectOne(query, params);
  }

  newClient(config) {
    config = _.defaults({}, config, this.config);
    return DB.newInstance(config);
  }

}

module.exports = SQLite;

SQLite.DB = DB;