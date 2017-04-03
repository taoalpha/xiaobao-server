"use strict";

const bodyParser = require("body-parser"),
  utils = require("../helpers");


module.exports = function () {

  this.app.use(bodyParser.json(), bodyParser.urlencoded({extended: true}), bodyParser.text(), function (req, res, next) {
    next();
  });

};