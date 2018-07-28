import forEach from "lodash.foreach";
import find from "lodash.find";

import GameEventHandler from "./gameEventHandler";
import Utils from "../utils";

export default class UpdateNpcs extends GameEventHandler {
  /**
   * @param {Array.<Asset>} assets
   * @param {Display} display
   * @param {TileUtilities} tiledUtils
   */
  constructor(assets, display, tiledUtils) {
    super();

    this.assets = assets;
    this.display = display;
    this.tiledUtils = tiledUtils;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    var currentArea = this.display.currentArea;
    if(!currentArea) {
      return;
    }

    var currentAreaMap = currentArea.areaMap;
    var spritesLayer = currentAreaMap.getObject("Sprites");

    forEach(cosmos.npcStates, (npcState) => {
      if(npcState.idleFrames-- > 0) {
        return;
      }
      npcState.idleFrames = npcState.speed;

      var npcSprite = find(spritesLayer.children,
        (child) => child.x === npcState.x && child.y === npcState.y && child.name === npcState.type);

      if(npcState.isMonster) {
        this.processAsMonster(currentArea, npcState, npcSprite, cosmos, frameId);
      }
      else {
        this.processAsCritter(currentArea, npcState, npcSprite, cosmos, frameId);
      }
    });
  }

  processAsCritter(currentArea, npcState, npcSprite, cosmos, frameId) {
    var randomDirection = 2 * Math.PI * Math.random(),
      willMove, newX, newY, tileInfo;

    switch(npcState.type) {
      case "Peon":
        willMove = Math.random() > 0.8;   // most of the time Peons will loaf about

        newX = Utils.normalizeCoord(npcState.x + (Math.round(Math.cos(randomDirection)) * 32));
        newY = Utils.normalizeCoord(npcState.y + (Math.round(Math.sin(randomDirection)) * 32));

        tileInfo = this.tiledUtils.getGroundAttributeAtCoords("walkable", currentArea, newX, newY);
        if (willMove && Utils.isTruthy(tileInfo.value)) {
          npcState.x = newX;
          npcState.y = newY;
          npcSprite.x = newX;
          npcSprite.y = newY;

          cosmos.actionsTaken.push(`${frameId} npc (${npcState.name} ${npcState.id}) meanders`);
        }
        break;
    }
  }

  processAsMonster(currentArea, npcState, npcSprite, cosmos, frameId) {

  }
}
