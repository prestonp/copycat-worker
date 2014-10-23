var query = require('pg-query');
var config = require('./config');
query.connectionParameters = config.pg.connStr;

var db = {
  query: query
};

module.exports = db;
