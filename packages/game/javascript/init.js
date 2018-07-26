"use strict";

import map from "lodash.map";
import concat from "lodash.concat";

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
   * @param {TileUtilities} tiledUtils
   * @param {PIXI} PIXI
   */
  constructor(assetManager, gameLoop, pixiApp, display, keymap, tiledUtils, PIXI) {
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
     * @name Init#tiledUtils
     * @type {TileUtilities}
     */
    this.tiledUtils = tiledUtils;

    /**
     * @name Init#PIXI
     * @type {PIXI}
     */
    this.PIXI = PIXI;
  }

  run() {
    var allMaps = map(require.context('../maps/', true, /\.json$/).keys(),
      (mapPath) => new MapAsset(/([a-zA-Z0-9_]+)\.json$/.exec(mapPath)[1], "Scavengers"));
    var allSprites = map(require.context('../sprites/', true, /\.png$/).keys(),
      (spritePath) => new AnimatedSpriteAsset(/([a-zA-Z0-9_]+)\.png$/.exec(spritePath)[1]));

    this.assetManager.loadAll(concat(allMaps, allSprites)).then((assets) => {
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
        new UpdateArea(this.display, this.PIXI, assets),
        new UpdateHero(this.display, this.PIXI, this.tiledUtils, assets),
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
        {name: "hero climb", combo: "c", repeating: false,
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
  "assetManager", "gameLoop", "pixiApp", "display", "keymap", "tiledUtils", "PIXI");
