"use strict";

import { injector } from "jsuice";

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
