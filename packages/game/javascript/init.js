"use strict";

import { injector } from "jsuice";

// testInkJson = require("../dialogue/test.json");
// import runStory from "./runStory";


class Init {
  /**
   * @param {PIXI} PIXI
   * @param {TileUtilities} tiledUtils
   * @param {RenderLoop} renderLoop
   * @param {jQuery} $
   */
  constructor(PIXI, tiledUtils, renderLoop, $) {
    /**
     * @name Init#PIXI
     * @type {PIXI}
     */
    this.PIXI = PIXI;

    /**
     * @name Init#tiledUtils
     * @type {TileUtilities}
     */
    this.tiledUtils = tiledUtils;

    this.app = new PIXI.Application({
      width: 256,         // default: 800
      height: 256,        // default: 600
      antialias: false,   // default: false
      transparent: false, // default: false
      resolution: 1,      // default: 1
      forceCanvas: PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
    });

    this.app.renderer.autoResize = true;
    this.app.renderer.resize(512, 512);
    this.app.renderer.backgroundColor = 0x061639;

    $(document.body).append(this.app.view);

    this.renderLoop = renderLoop;
    renderLoop.start();
  }

  run() {
    var self = this,
      PIXI = self.PIXI;

    PIXI.loader
      .add({
        name: "fighter_01",
        url: require("../tiles/fighter_01.png")
      })
      .load(function() {
        var sprite = new PIXI.Sprite(PIXI.loader.resources["fighter_01"].texture);

        self.app.stage.addChild(sprite);
      });

    // runStory(testInkJson);
  }
}

export default injector.annotateConstructor(Init, injector.SINGLETON_SCOPE, "PIXI", "tiledUtils", "renderLoop", "$");
