/**
 * Server Configuration
 *
 * WARNING - DO NOT EXPOSE THIS FILE PUBLICLY
 */

"use strict";

const fs = require("fs"),
  childProcess = require("child_process"),
  pkg = require("../package.json"),
  env = process.env.NODE_ENV === "production" ? "production" : "development",
  isProd = process.env.NODE_ENV === "production";



let config = {

  // Environment
  env: env,
  isProd: isProd,
  version: pkg.version,

  // Features
  mock: false,

  // Hosting
  port: 3001,

  // db
  mongo: "mongodb://localhost:27017/xiaobao"
};



/**
 * Override via process.argv
 * - i.e. node server.js port=1234
 */
process.argv.slice(2).forEach(kv => {
  let split = kv.split("=");
  if (!(split[0] in config)) return;
  let value = split[1];
  if (value && value.toLowerCase() == "false") value = false;
  if (value === null || value === undefined || value === "" || value === "true") value = true;
  config[split[0]] = value;
});



/**
 * Add Meta Information
 */
try {
  config.pid = process.pid;
  config.commit = (childProcess.execSync("git describe --long --tags --always") + "" || "").trim();
} catch (e) {}



module.exports = config;