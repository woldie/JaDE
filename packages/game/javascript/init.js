"use strict";

import { injector } from "jsuice";
import * as PIXI from "pixi.js";
import $ from "jquery";
import MapAsset from "./assets/mapAsset";

// testInkJson = require("../dialogue/test.json");
// import runStory from "./runStory";


class Init {
  /**
   * @param {AssetManager} assetManager
   * @param {RenderLoop} renderLoop
   */
  constructor(assetManager, renderLoop) {
    var self = this;

    /**
     * @name Init#assetManager
     * @type {AssetManager}
     */
    self.assetManager = assetManager;

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
    var self = this,

      handmadeMap = new MapAsset("testmap", "tiled-example-ortho-outdoor");

    self.assetManager.loadAll([
      handmadeMap

      // TODO:  create an animated sprite generator/loader class that will serve as an object sprite we will replace in the handmadeMap
    ]).then(function(assets) {
      // this is where game-specific world randomization and trigger prepping occurs

      self.app.stage.addChild(handmadeMap.areaMap);
    }, function() {
      alert("failed to load?!");
    });

    // DELETE ME
    //PIXI.loader
    //  .add({
    //    name: "fighter_01",
    //    url: require("../tiles/fighter_01.png")
    //  })
    //  .add({
    //    name: "tiled-example-ortho-outdoor",
    //    url: require("../tilesets/tiled-example-ortho-outdoor.png")
    //  })
    //  .load(function(loader, resources) {
    //    //var sprite = new PIXI.Sprite(PIXI.loader.resources["fighter_01"].texture);
    //    //
    //    //self.app.stage.addChild(sprite);
    //    var world = self.tiledUtils.makeTiledWorld(require("../maps/testmap.json"), "tiled-example-ortho-outdoor");
    //
    //    var objectsLayer = world.getObject("objects");
    //    console.log(objectsLayer);
    //
    //    self.app.stage.addChild(world);
    //  });

    // runStory(testInkJson);
  }
}

export default injector.annotateConstructor(Init, injector.SINGLETON_SCOPE, "assetManager", "renderLoop");
