"use strict";
const MongoClient = require('mongodb').MongoClient,
      config = require("../config");

module.exports = function () {

  return (req, res, next) => {
    if (!this.db) {
      // initialize db
      MongoClient.connect(config.mongo, {  
        poolSize: 10
      }, (err, db) => {
          req.db = this.db = this.app.locals.db = db;
          next();
        }
      );
    } else {
      req.db = this.db;
      next();
    }
  };

};
