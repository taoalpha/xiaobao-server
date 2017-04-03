"use strict";
const express = require("express"),
      _ = require("lodash"),
      bodyParser = require("body-parser"),
      middleware = require("./middlewares"),
      config = require("./config")

module.exports = function (sequence, start) {

  let app = express();

  // record request time
  app.use((req, res, next) => {
    req._hrtime = process.hrtime();
    req._time = Date.now();
    next();
  });


  // all interfaces and start points
  app.set("views", __dirname + "/views")
  app.engine("jade", require("jade").__express)
  app.set("view engine", "jade")

  let server = null;

  //Apply the sequence of startup middleware
  let mstr = ["\nEnabling Middleware:"];

  // if no specified, use all
  sequence = sequence || Object.keys(middleware);

  let context = {
    app: app,
    server: server,
    express: express,
    config: config
  };

  sequence.forEach(function (def) {

    //Convert shortcut strings to objects
    if (_.isString(def)) {
      def = {name: def};
    }

    context.options = def.options || {};    

    //Allow inline functions
    if (_.isFunction(def)) {
      return app.use(def.bind(context));
    }

    //Skip if the middleware cannot be found
    if (!def || !def.name || !middleware[def.name] || def.enabled === false) {
      return;
    }

    mstr.push(" - " + def.name);

    context.options = Object.assign({}, middleware[def.name].defaults, context.options);
    let fn = middleware[def.name].call(context, context.options);

    // Use the function if one is returned
    if (_.isFunction(fn)) {
      app.use(fn);
    }

  });

  console.log(mstr.join("\n"));

  if (start !== false) {
    server = app.listen(config.port, () => {
      let configDetails = ["pid", "commit", "port"].map(n => "\n - " + n + " = " + config[n]).join("");
      console.log(`\nServer Started ${configDetails} \n`);
    });
  }


  return app;
};