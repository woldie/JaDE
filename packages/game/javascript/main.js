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

import * as PIXI from "pixi.js";

var $ = require("jquery"),

  runStory = require("./runStory"),
  //testInkJson = require("../dialogue/test.json"),

  injector = require("jsuice");

require("./jadeModule");

var app = new PIXI.Application({
  width: 256,         // default: 800
  height: 256,        // default: 600
  antialias: false,   // default: false
  transparent: false, // default: false
  resolution: 1,      // default: 1
  forceCanvas: PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
});

app.renderer.autoResize = true;
app.renderer.resize(512, 512);

$(document.body).append(app.view);

app.renderer.backgroundColor = 0x061639;

PIXI.loader
  .add({
    name: "fighter_01",
    url: require("../tiles/fighter_01.png")
  })
  .load(function() {
    console.log(PIXI.loader.resources["fighter_01"].texture);

    var sprite = new PIXI.Sprite(PIXI.loader.resources["fighter_01"].texture);

    app.stage.addChild(sprite);
  });

// runStory(testInkJson);

var renderLoop = /** @type {RenderLoop} */ injector.getInstance("RenderLoop");

renderLoop.start();
