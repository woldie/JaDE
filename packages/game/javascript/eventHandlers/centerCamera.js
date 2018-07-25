import GameEventHandler from "./gameEventHandler";

import find from "lodash.find";
import Constants from "../constants";

var CENTER_CAMERA_TYPE = "CenterCamera";

/**
 *
 */
export default class CenterCamera extends GameEventHandler {
  /**
   * @param {Display} display
   * @param {Array.<Asset>} assets
   */
  constructor(display, assets) {
    super();
    this.type = CENTER_CAMERA_TYPE;

    /**
     * @name CenterCamera#display
     * @type {Display}
     */
    this.display = display;

    /**
     * @name CenterCamera#assets
     * @type {Array.<Asset>}
     */
    this.assets = assets;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    var currentArea = this.display.currentArea;
    if(!currentArea) {
      return;
    }

    var heroSprite = currentArea.areaMap.getObject("Hero");

    currentArea.camera.follow(heroSprite);
  }
}
