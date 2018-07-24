import GameEventHandler from "./gameEventHandler";
import Constants from "../constants";

import find from "lodash.find";

var UPDATE_HERO_TYPE = "UpdateHero";

/**
 * Ensures that the current area has the hero sprite added to the Sprites at the correct location
 */
export default class UpdateHero extends GameEventHandler {
  /**
   *
   * @param {Display} display
   * @param {PIXI} PIXI
   * @param {Array.<Asset>} assets
   */
  constructor(display, PIXI, assets) {
    super();

    this.type = UPDATE_HERO_TYPE;
    this.assets = assets;
    this.PIXI = PIXI;
    this.display = display;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    var currentArea = this.display.currentArea.areaMap;
    var spritesLayer = currentArea.getObject("Sprites");
    var heroSprite = find(spritesLayer.children, (child) => child.name === Constants.HERO);

    if(!heroSprite) {
      var heroAsset = find(this.assets, (asset) =>
          asset.name === Constants.HERO);
      heroSprite = heroAsset.createAnimatedSprite(this.PIXI, Constants.HERO);
      spritesLayer.addChild(heroSprite);
      currentArea.objects.push(heroSprite);
    }
  }
}
