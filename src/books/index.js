"use strict";
const fs = require("fs");
const bookStore = {};

fs.readdirSync(__dirname + "/").forEach(function (file) {
  if (file !== "index.js") {
    bookStore[file.split(".")[0]] = file;
  }
})


module.exports = function (name, cb) {
  try {
    let words = null;
    if (name) {
      words = fs.readFileSync(__dirname + "/" + bookStore[name], "utf-8").split("\n");
    } else {
      let keys = Object.keys(bookStore);
      words = fs.readFileSync(__dirname + "/" + bookStore[keys[Math.floor(Math.random() * keys.length)]], "utf-8");
    }
    cb(null, words);
  } catch (e) {
    cb(e);
  }
}