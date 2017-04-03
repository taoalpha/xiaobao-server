"use strict";

module.exports = function (options) {

  this.app.all("/*?", function (req, res, next) {
    res.status(404).send(options.message);
  });

};

module.exports.defaults = {
  message: `404 Not Found`
};
