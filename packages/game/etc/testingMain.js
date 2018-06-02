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

//var root;
//
//root = (typeof window !== "undefined") ? window : (global || this);
//root["root"] = root;
//root["global"] = root["global"] || root;
//
//root.Utils = root.Utils || {};
//
//Utils.bootstrapModule = true;
//Utils.kidcompyModule = true;
//Utils.polyfillsModule = true;

if(typeof window !== "undefined") {
  // loads the global namespace with 'expect' so that all tests have access to it by default
  window["expect"] = require("expectant");
}

var Promise = require("bluebird");

Promise.config({
  warnings: true,
  monitoring: true
});

//var quixotePromise = null;
//
//Utils.getQuixoteFramePromise = function() {
//  if(!quixotePromise) {
//    quixotePromise = new Promise(function (resolve) {
//      // need to pause mocha for kidcompy's onCodeGo event to fire.  This ensures that all the scripts have loaded AND
//      // inited before we attempt to run our tests
//      Utils.addOnReadyHandler(function () {
//        var startQuixoteTime = Date.now();
//
//        // create the quixote frame
//        var quixoteFrame = quixote.createFrame({
//          stylesheet: require("!url?limit=1&mimeType=text/css&name=[name].css?[hash]" +
//            "!text-webpack" +
//            "!less?outputStyle=expanded!../src/main/less/kidcompy.less")
//        }, function () {
//          var endQuixoteTime = Date.now();
//
//          // console.log("quixote frame inited in " + (endQuixoteTime - startQuixoteTime) + " msec");
//
//          resolve(quixoteFrame);
//        });
//      });
//
//      Utils.flushOnReadyHandlers();
//    });
//  }
//
//  return quixotePromise;
//};

//var kidcompyPromise = null;
//
//Utils.getTestKidcompyInstancePromise = function() {
//  if(!kidcompyPromise) {
//    kidcompyPromise = new Promise(function (resolve) {
//      Utils.addOnLoadHandler(function () {
//        $(document).find("body").prepend("<div id='contents_target'></div>");
//
//        var width = 640,
//          height = 480,
//          injectTargetId = "#contents_target",
//          parameters = {demoMode: true},
//          kcInstance = Utils.createCompyInstance();
//
//        kcInstance.callOnShellStart = function () {
//          kcInstance.shell.callOnNextFlip(function() {
//            kcInstance.shell.callOnNextFlip(function() {
//              resolve(kcInstance);
//            });
//          });
//        };
//
//        Utils.injectKidCompy(kcInstance, width, height, injectTargetId, null, null, true, true, parameters);
//      });
//
//      Utils.flushOnLoadHandlers();
//    });
//  }
//
//  return kidcompyPromise;
//};
//
//// shim in old sinon.test symbol from the new-fangled sinon-test helper library for sinon
//var sinonTest = require('sinon-test')(sinon);
//sinon.test = sinonTest;

/*
 * Root hooks that are installed before all tests, making sure we have a compy and a quixote shell setup
 * before units are run
 */

if(typeof window !== "undefined" && window.top.runTestingMain) {
  before(function() {
    console.log("Test Run: " + (new Date()));
  });

  after(function() {
    //var kidcompyTeardownDeferred = Promise.defer();
    //var quixoteTeardownDeferred = Promise.defer();
    //
    //if(kidcompyPromise) {
    //  kidcompyPromise.then(function(KidCompy) {
    //      KidCompy.teardown();
    //      kidcompyPromise = null;
    //    })
    //    .lastly(function() {
    //      kidcompyTeardownDeferred.resolve();
    //    });
    //}
    //else {
    //  kidcompyTeardownDeferred.resolve();
    //}
    //
    //if(quixotePromise) {
    //  quixotePromise.then(function(quixoteFrame) {
    //      quixoteFrame.remove();
    //      quixotePromise = null;
    //    })
    //    .lastly(function() {
    //      quixoteTeardownDeferred.resolve();
    //    });
    //}
    //else {
    //  quixoteTeardownDeferred.resolve();
    //}
    //
    //Promise.all([quixoteTeardownDeferred.promise, kidcompyTeardownDeferred.promise]).then(function() {
    //  done();
    //});
  });

  // this is just here to get the before() hook above to trigger
  it("starts with one test", function () {
    expect.isTrue(true, "yeah, it passes");
  });
}
