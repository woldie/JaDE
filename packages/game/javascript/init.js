"use strict";

import { injector } from "jsuice";
import * as PIXI from "pixi.js";
import $ from "jquery";

// testInkJson = require("../dialogue/test.json");
// import runStory from "./runStory";


class Init {
  /**
   * @param {TileUtilities} tiledUtils
   * @param {RenderLoop} renderLoop
   */
  constructor(tiledUtils, renderLoop) {
    var self = this;

    /**
     * @name Init#tiledUtils
     * @type {TileUtilities}
     */
    self.tiledUtils = tiledUtils;

    /**
     * @name Init#app
     * @type {PIXI.Application}
     */
    self.app = new PIXI.Application({
      width: 256,         // default: 800
      height: 256,        // default: 600
      antialias: false,   // default: false
      transparent: false, // default: false
      resolution: 1,      // default: 1
      forceCanvas: PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
    });

    self.app.renderer.autoResize = true;
    self.app.renderer.resize(512, 512);
    self.app.renderer.backgroundColor = 0x061639;

    $(document.body).append(this.app.view);

    this.renderLoop = renderLoop;
    renderLoop.start();
  }

  run() {
    var self = this;

    PIXI.loader
      .add({
        name: "fighter_01",
        url: require("../tiles/fighter_01.png")
      })
      .add({
        name: "tiled-example-ortho-outdoor",
        url: require("../tilesets/tiled-example-ortho-outdoor.png")
      })
      .load(function(loader, resources) {
        //var sprite = new PIXI.Sprite(PIXI.loader.resources["fighter_01"].texture);
        //
        //self.app.stage.addChild(sprite);
        var world = self.tiledUtils.makeTiledWorld(require("../maps/testmap.json"), "tiled-example-ortho-outdoor");
        self.app.stage.addChild(world);
      });

    // runStory(testInkJson);
  }
}

export default injector.annotateConstructor(Init, injector.SINGLETON_SCOPE, "tiledUtils", "renderLoop");
