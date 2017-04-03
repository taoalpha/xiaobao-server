"use strict";

/**
 * Aggregator
 */

var fs = require("fs");

module.exports = {};

fs.readdirSync(__dirname + "/").forEach(function (file) {
  if (file.match(/.+\.js/g) !== null && file !== "index.js") {
    module.exports[file.replace(".js", "")] = require("./" + file);
  }
});