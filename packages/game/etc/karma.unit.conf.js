"use strict";

// jscs: disable
/* jshint -W079 */
var path = require("path"),
  _ = require("lodash");

module.exports = function(config) {
  var baseKarmaConfig = require("./karma.base.conf.js")(config),
    configOverrides;

  configOverrides = {
    // list of files / patterns to load in the browser
    files: [
      path.resolve(__dirname, "testingMain.js"),
      path.resolve(__dirname, "karma.unit.files.js")
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {}
  };

  // this redundant preprocessor seems necessary to get the files item on line 36 (bootstrap/main.js) to be webpack'ed
  configOverrides.preprocessors[path.resolve(__dirname, "karma.unit.files.js")] = ["webpack"];
  configOverrides.preprocessors[path.resolve(__dirname, "testingMain.js")] = ["webpack"];

  return _.extend(baseKarmaConfig, configOverrides);
};
