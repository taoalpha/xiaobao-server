"use strict";

const express = require("express");

module.exports = function () {

  this.app.use(express.static(__dirname + "/public"));

};