/**
 * @license
 * JaDE - A roguelike game engine for HTML.
 * <br />Copyright (C) 2018  Woldrich, Inc.
 *
 * <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *   <img alt="Creative Commons License" style="border-width:0"
 *        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
 *   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *     Creative Commons Attribution-ShareAlike 4.0 International License
 *   </a>.
 */

"use strict";

// jscs: disable
/* jshint -W079 */
var path = require("path"),
  extend = require("lodash.assignin");

module.exports = function(config) {
  var baseKarmaConfig = require("./karma.base.conf.js")(config),
    configOverrides;

  configOverrides = {
    // list of files / patterns to watch and load in the browser
    files: [
      { pattern: "etc/testingMain.js", watched: true },
      { pattern: "etc/karma.unit.files.js", watched: true }
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {}
  };

  // this redundant preprocessor seems necessary to get the files item on line 36 (bootstrap/main.js) to be webpack'ed
  configOverrides.preprocessors["etc/karma.unit.files.js"] = ["webpack"];
  configOverrides.preprocessors["etc/testingMain.js"] = ["webpack"];

  return extend(baseKarmaConfig, configOverrides);
};
