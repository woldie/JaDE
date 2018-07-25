"use strict";

import forEach from "lodash.foreach";
import clone from "lodash.clone";
import remove from "lodash.remove";

import { injector } from "jsuice";

import GameUtilities from "pixi-game-utilities";

class Display {
  /**
   * @param {PIXI.Application} pixiApp
   */
  constructor(pixiApp) {
    /**
     * @name Display#pixiApp
     * @type {PIXI.Application}
     */
    this.pixiApp = pixiApp;

    /**
     * @name Display#currentArea
     * @type {(MapAsset|null)}
     */
    this.currentArea = null;

    /**
     * @name Display#gu
     * @type {GameUtilities}
     */
    this.gu = new GameUtilities();
  }

  /**
   * @param {(MapAsset|null)} mapAsset
   */
  changeCurrentArea(mapAsset) {
    if(this.currentArea === mapAsset) {
      // current area already set to mapAsset
      return;
    }

    this.removeCurrentAreaFromPixiApp();
    this.resetCurrentArea();

    this.currentArea = mapAsset;
    this.addCurrentAreaToPixiApp();
  }

  /**
   * @typedef {{follow: function(PIXI.Sprite), centerOver: function(PIXI.Sprite)}} Camera
   */

  /**
   * <p>Make a camera that can dynamically offset a tiled map on the display.
   *
   * @param {PIXI.Container} tiledMap
   * @param {number} width
   * @param {number} height
   * @returns {Camera}
   */
  makeCamera(tiledMap, width, height) {
    return this.gu.worldCamera(tiledMap, width, height, this.pixiApp.view);
  }

  /**
   * @private
   */
  removeCurrentAreaFromPixiApp() {
    var currentArea = this.currentArea;
    if(currentArea) {
      this.pixiApp.stage.removeChild(currentArea.areaMap);
    }
  }

  /**
   * @private
   */
  resetCurrentArea() {
    var currentArea = this.currentArea;
    if(currentArea) {

      var spriteCollection = currentArea.areaMap.getObject("Sprites");
      var sprites = clone(spriteCollection.children);
      forEach(sprites, (sprite) => {
        spriteCollection.removeChild(sprite);
        remove(currentArea.areaMap.objects, (obj) => obj === sprite);
      });
    }
  }

  /**
   * @private
   */
  addCurrentAreaToPixiApp() {
    var currentArea = this.currentArea;
    if(currentArea) {
      this.pixiApp.stage.addChild(currentArea.areaMap);
    }
  }
}

export default injector.annotateConstructor(Display, injector.SINGLETON_SCOPE, "pixiApp");
