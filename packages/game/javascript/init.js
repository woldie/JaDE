"use strict";

import { injector } from "jsuice";
import * as PIXI from "pixi.js";
import MapAsset from "./assets/mapAsset";
import AnimatedSpriteAsset from "./assets/animatedSpriteAsset";

// testInkJson = require("../dialogue/test.json");
// import runStory from "./runStory";


class Init {
  /**
   * @param {AssetManager} assetManager
   * @param {GameLoop} gameLoop
   * @param {PIXI.Application} pixiApp
   * @param {Display} display
   */
  constructor(assetManager, gameLoop, pixiApp, display) {
    var self = this;

    /**
     * @name Init#assetManager
     * @type {AssetManager}
     */
    self.assetManager = assetManager;

    /**
     * @name Init#pixiApp
     * @type {PIXI.Application}
     */
    self.pixiApp = pixiApp;

    /**
     * @name Init#display
     * @type {Display}
     */
    self.display = display;

    /**
     *
     * @type {GameLoop}
     */
    this.gameLoop = gameLoop;
    gameLoop.start();
  }

  run() {
    var self = this,

      handmadeMap = new MapAsset("testmap", "tiled-example-ortho-outdoor"),
      fighterSprite = new AnimatedSpriteAsset("fighter", [
        { frameset: "default", frameCount: 2 }
      ]);

    self.assetManager.loadAll([
      handmadeMap,
      fighterSprite

      // TODO:  create an animated sprite generator/loader class that will serve as an object sprite we will replace in the handmadeMap
    ]).then((assets) => {
      // this is where game-specific world randomization and trigger prepping occurs

      // when the game starts, one map is selected for
      //self.pixiApp.stage.addChild(handmadeMap.areaMap);
      this.display.changeCurrentArea(handmadeMap);

      this.pixiApp.stage.addChild(fighterSprite.sprite);
    }, (err) => {
      console.log(err);
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

export default injector.annotateConstructor(Init, injector.SINGLETON_SCOPE,
  "assetManager", "gameLoop", "pixiApp", "display");
