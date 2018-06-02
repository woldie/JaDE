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
  fs = require("fs"),
  _ = require("lodash");

function makeTestingWebpackConfig(outputModuleName) {
  var entryObj = {};

  entryObj[outputModuleName] = path.resolve(__dirname, "./testingMain.js");

  return {
    entry: entryObj,
    devtool: "inline-source-map",
    resolve: {
      extensions: [ ".js" ]
    },
    plugins: [
    ],
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        { test: /\.hbs$/, loader: "handlebars-loader" }
      ]
    },
    output: {
      libraryTarget: "this",
      path: path.resolve("../intermediate"),
      filename: outputModuleName + ".js"
    }
  };
}

module.exports = function(config) {
  var commonSettings = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: path.resolve(__dirname, ".."),

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "proclaim", "quixote"],

    plugins: [
      require("karma-webpack-with-fast-source-maps"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-proclaim"),
      require("karma-quixote"),
      require("karma-firefox-launcher"),
      require("karma-sourcemap-loader"),
      require("karma-super-dots-reporter")
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["super-dots", "mocha"],

    mochaReporter: {
      output: "minimal",
      colors: {
        info: "cyan"
      }
    },

    superDotsReporter: {
      icon: {
        success: "."
      }
    },

    client: {
      mocha: {
        reporter: "html",
        ui: "bdd",
        timeout: 240000
      }
    },

    // list of files / patterns to load in the browser provided by extensions to this base config
    files: [
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    webpack: makeTestingWebpackConfig("testing"),

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Limit browsers running karma tests concurrently to one at a time
    concurrency: 1,

    // limit time before a browser times out on activity
    browserNoActivityTimeout: 240000
  };

  // webpack preprocessing should occur on files loaded by extensions to this config
  // commonSettings.preprocessors[path.resolve(__dirname, "karma.base.files.js")] = ["webpack"];

  return _.extend(config, commonSettings);
};
