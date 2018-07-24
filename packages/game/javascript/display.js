"use strict";

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
  }

  /**
   * @private
   */
  resetCurrentArea() {
  }

  /**
   * @private
   */
  addCurrentAreaToPixiApp() {
    this.pixiApp.stage.addChild(this.currentArea.areaMap);
  }
}

export default injector.annotateConstructor(Display, injector.SINGLETON_SCOPE, "pixiApp");
