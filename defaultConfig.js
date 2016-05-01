"use strict";

const sqlite3 = require('sqlite3');

module.exports = {
  filename: ':memory:',
  mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  init: function(db, done) {
    done();
  }
};