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
    var heroSprite = this.display.currentArea.areaMap.getObject("Hero");

    var nextX = Math.max(0, heroSprite.x + ((Math.round(Math.random() * 2) - 1) * 32));
    var nextY = Math.max(0, heroSprite.y + ((Math.round(Math.random() * 2) - 1) * 32));

    if(nextX !== heroSprite.x || nextY !== heroSprite.y) {
      heroSprite.x = nextX;
      heroSprite.y = nextY;

      this.display.currentArea.camera.follow(heroSprite);
    }
  }
}
