"use strict";

/**
 * Allow CORS
 */

module.exports = function () {

  return function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, amp-*, amp-projectkey");

    //If options method is detected, immediately return 200 (xhr preflight)
    if (req.method == "OPTIONS") {
      res.sendStatus(200);
      return;
    }

    next();
  };

};
