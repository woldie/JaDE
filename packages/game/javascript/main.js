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

var PixiApplication = require("@pixi/app").Application,
  PixiUtils = require("@pixi/utils"),
  $ = require("jquery"),

  runStory = require("./runStory"),
  testInkJson = require("../dialogue/test.json");

var app = new PixiApplication({
  width: 256,         // default: 800
  height: 256,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default:    false
  resolution: 1,      // default: 1
  forceCanvas: PixiUtils.isWebGLSupported() ? "WebGL" : "canvas"
});

$(document.body).append(app.view);

app.renderer.backgroundColor = 0x061639;

runStory(testInkJson);
