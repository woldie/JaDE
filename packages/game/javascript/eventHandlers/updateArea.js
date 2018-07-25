import filter from "lodash.filter";
import find from "lodash.find";
import forEach from "lodash.foreach";

import GameEventHandler from "./gameEventHandler";
import Constants from "../constants";
import Utils from "../utils";

var UPDATE_AREA_TYPE = "UpdateArea";

/**
 * The purpose of this game event handler is to set the displayed area to the correct one listed in the cosmos and
 * then centering the view on the player location listed in the cosmos.
 *
 * Then onstop, any currently displayed view should be removed
 */
export default class UpdateArea extends GameEventHandler {
  constructor(display, PIXI, assets) {
    super();
    this.type = UPDATE_AREA_TYPE;

    this.display = display;
    this.PIXI = PIXI;
    this.assets = assets;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    if(cosmos.commands.changeArea) {
      var newAreaName = cosmos.commands.changeArea.name;
      delete cosmos.commands.changeArea;

      var newAreaAsset = find(this.assets, (asset) => asset.name === newAreaName);

      if(!newAreaAsset) {
        this.criticalError(`Could not find area asset named ${newAreaName}`);
      }

      this.display.changeCurrentArea(newAreaAsset);

      cosmos.playerState.currentArea = newAreaName;
      cosmos.actionsTaken.push(`Area changed to '${newAreaName}'`);

      // place NPC's
      var newMap = /** @type {PIXI.Container} */ newAreaAsset.areaMap;
      var spritesLayer = newMap.getObject("Sprites");
      forEach(filter(newMap.objects, (obj) => obj.type === "npc"), (npcObj) => {
        var nameParts = /([a-zA-Z0-9_]+)(-(.*))?/.exec(npcObj.name);
        var spriteName = nameParts[1];
        var npcName = npcObj.name.indexOf('-') >= 0 ? nameParts[3] : nameParts[1];

        var npcAsset = find(this.assets, (asset) => asset.name === spriteName);

        var npcSprite = npcAsset.createAnimatedSprite(this.PIXI, spriteName);
        spritesLayer.addChild(npcSprite);
        npcSprite.x = Utils.normalizeCoord(npcObj.x);
        npcSprite.y = Utils.normalizeCoord(npcObj.y);
        newMap.objects.push(npcSprite);

        cosmos.actionsTaken.push(`  NPC placed '${npcName}'`);
      });
    }
  }
}

