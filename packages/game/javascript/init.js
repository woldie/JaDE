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
   * @param {Keymap} keymap
   * @param {PIXI} PIXI
   */
  constructor(assetManager, gameLoop, pixiApp, display, keymap, PIXI) {
    /**
     * @name Init#assetManager
     * @type {AssetManager}
     */
    this.assetManager = assetManager;

    /**
     * @name Init#pixiApp
     * @type {PIXI.Application}
     */
    this.pixiApp = pixiApp;

    /**
     * @name Init#display
     * @type {Display}
     */
    this.display = display;

    /**
     * @name Init#gameLoop
     * @type {GameLoop}
     */
    this.gameLoop = gameLoop;

    /**
     * @name {Init#keymap}
     * @type {Keymap}
     */
    this.keymap = keymap;

    /**
     * @name Init#PIXI
     * @type {PIXI}
     */
    this.PIXI = PIXI;
  }

  run() {
    var handmadeMap = new MapAsset("HomeTown", "Scavengers"),
      DamDungeonA = new MapAsset("DamDungeonA", "Scavengers"),
      fighterSprite = new AnimatedSpriteAsset(Constants.HERO, [
        { frameset: "default", frameCount: 2 }
      ]);

    this.assetManager.loadAll([
      handmadeMap,
      DamDungeonA,
      fighterSprite

      // TODO:  create an animated sprite generator/loader class that will serve as an object sprite we will replace in the handmadeMap
    ]).then((assets) => {
      // the cosmos started out null and without form ... cosmos is sourced from the global window object so that it
      // can survive webpack hot reloads
      var cosmos = (window.cosmos = window.cosmos || {
        playerState: {
          up: 0,
          down: 0,
          left: 0,
          right: 0
        },
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

      // keyboard mapping, we'll refactor this to live wherever it should it should in the future
      this.keymap.pushProfile([
        {name: "hero up", combo: "up", repeating: false,
          keyDown: function() { cosmos.playerState.up = true; },
          keyUp: function() { cosmos.playerState.up = false; }},
        {name: "hero down", combo: "down", repeating: false,
          keyDown: function() { cosmos.playerState.down = true; },
          keyUp: function() { cosmos.playerState.down = false; }},
        {name: "hero left", combo: "left", repeating: false,
          keyDown: function() { cosmos.playerState.left = true; },
          keyUp: function() { cosmos.playerState.left = false; }},
        {name: "hero right", combo: "right", repeating: false,
          keyDown: function() { cosmos.playerState.right = true; },
          keyUp: function() { cosmos.playerState.right = false; }},
        {name: "hero climb", combo: "k", repeating: false,
          keyDown: function() { },
          keyUp: function() { cosmos.commands.climb = true; }}
      ]);

      // This is where area randomization and trigger prepping occurs.  This part might take a lot of CPU time.

      // set an area in the cosmos to transition to as our starting point if we don't already have one
      if(!cosmos.playerState.currentArea) {
        cosmos.commands.changeArea = {
          name: "HomeTown"
        };
        cosmos.commands.teleportTo = {
          objectName: "StartingPoint"
        }
      }
    }, (err) => {
      console.log(err);
      alert("failed to load?!");
    });

    // DELETE ME
    // runStory(testInkJson);
  }
}

export default injector.annotateConstructor(Init, injector.SINGLETON_SCOPE,
  "assetManager", "gameLoop", "pixiApp", "display", "keymap", "PIXI");
