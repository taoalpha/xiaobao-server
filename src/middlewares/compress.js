"use strict";

const compression = require("compression");


module.exports = function () {
  this.app.use(compression());
};