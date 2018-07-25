"use strict";

import { injector } from "jsuice";
import Constants from "./constants";
import MapAsset from "./assets/mapAsset";
import AnimatedSpriteAsset from "./assets/animatedSpriteAsset";
import UpdateArea from "./eventHandlers/updateArea";
import UpdateHero from "./eventHandlers/updateHero";
import CenterCamera from "./eventHandlers/centerCamera";
import DebugCosmos from "./eventHandlers/debugCosmos";

// testInkJson = require("../dialogue/test.json");
// import runStory from "./runStory";


class Init {
  /**
   * @param {AssetManager} assetManager
   * @param {GameLoop} gameLoop
   * @param {PIXI.Application} pixiApp
   * @param {Display} display
   * @param {PIXI} PIXI
   */
  constructor(assetManager, gameLoop, pixiApp, display, PIXI) {
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
     * @name Init#gameLoop
     * @type {GameLoop}
     */
    this.gameLoop = gameLoop;

    /**
     * @name Init#PIXI
     * @type {PIXI}
     */
    this.PIXI = PIXI;
  }

  run() {
    var self = this,

      handmadeMap = new MapAsset("HomeTown", "Scavengers"),
      fighterSprite = new AnimatedSpriteAsset(Constants.HERO, [
        { frameset: "default", frameCount: 2 }
      ]);

    self.assetManager.loadAll([
      handmadeMap,
      fighterSprite

      // TODO:  create an animated sprite generator/loader class that will serve as an object sprite we will replace in the handmadeMap
    ]).then((assets) => {
      // the cosmos started out null and without form ... cosmos is sourced from the global window object so that it
      // can survive webpack hot reloads
      var cosmos = (window.cosmos = window.cosmos || {
        commands: {},
        actionsTaken: []
      });

      // Here we will process the objects layers in all of our areas, looking for starting points, NPC's, items to
      // pickup, etc and process those into our own data structures.  In the end of this processing, objects should be
      // an empty layer that we can fill with sprites and our player's character.  Everything parsed out of the maps
      // should be immutable.

      // initialize the game loop with event handlers
      this.gameLoop.start([
        new UpdateArea(this.display, assets),
        new UpdateHero(this.display, this.PIXI, assets),
        new CenterCamera(this.display, assets),
        new DebugCosmos()
      ]);
      this.gameLoop.changeCosmos(cosmos);

      // This is where area randomization and trigger prepping occurs.  This part might take a lot of CPU time.

      // set an area in the cosmos to transition to as our starting point if we don't already have one
      if(!cosmos.currentArea) {
        cosmos.commands.changeArea = {
          name: "HomeTown"
        };
      }

      // this.pixiApp.stage.addChild(fighterSprite.sprite);
    }, (err) => {
      console.log(err);
      alert("failed to load?!");
    });

    // DELETE ME
    // runStory(testInkJson);
  }
}

export default injector.annotateConstructor(Init, injector.SINGLETON_SCOPE,
  "assetManager", "gameLoop", "pixiApp", "display", "PIXI");
