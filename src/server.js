"use strict";

// Log errors
process.on("uncaughtException", function (err) {
  console.log("uncaught exception", err.stack);
});

// Start the Express Server
module.exports = require("./app")([

  "db",
  
  "libs",

  "compress",

  "allowCrossDomain",

  "bodyParser",

  "controllers",

  "unknown"
]);