import filter from "lodash.filter";
import find from "lodash.find";
import forEach from "lodash.foreach";

import Utils from "./utils";

export default class Npc {
  /**
   * Places an NPC sprite in the map and initializes the cosmos with their essence.
   *
   * Assumption is that npcObj is an Objects layer Tiled object with type === "npc".
   *
   * @param {PIXI.Container} npcObj raw object placed into the Tiled map that we base our NPC on.
   * @param {PIXI.Container} areaMapToPlaceSpriteInto
   * @param {Array.<Asset>} assets
   * @param {PIXI} PIXI
   * @param {Cosmos} cosmos
   */
  placeNpc(npcObj, areaMapToPlaceSpriteInto, assets, PIXI, cosmos) {
    var nameParts = /([a-zA-Z0-9_]+)(-(.*))?/.exec(npcObj.name);
    var spriteName = nameParts[1];
    var npcName = npcObj.name.indexOf('-') >= 0 ? nameParts[3] : nameParts[1];
    var npcType = nameParts[1];

    var npcAsset = find(assets, (asset) => asset.name === spriteName);

    var npcSprite = npcAsset.createAnimatedSprite(PIXI, spriteName);
    var spritesLayer = areaMapToPlaceSpriteInto.getObject("Sprites");

    spritesLayer.addChild(npcSprite);
    npcSprite.x = Utils.normalizeCoord(npcObj.x);
    npcSprite.y = Utils.normalizeCoord(npcObj.y);
    areaMapToPlaceSpriteInto.objects.push(npcSprite);

    // TODO:  Update the cosmos with the NPC's stats, position, mood, etc
    var npcState = {
      name: npcName,
      type: npcType,
      id: npcObj.id,                        // Tiled-assigned unique object ID for this map
      startX: npcSprite.x,
      startY: npcSprite.y,
      x: npcSprite.x,
      y: npcSprite.y,
      isMonster: false,                     // by default, most NPC are not monsters
      monsterStrategy: "Human",
      idleFrames: 0,                        // when reaches 0, sprite will do an update and set to speed
      hitPoints: 1,
      agro: 0,
      agroThreshold: 1/0,
      agroTargets: [],                       // sprite names of targets if NPC turns monster, can be other than Hero
      frameSet: "default",
      currentFrame: 0
    };

    switch(npcType) {
      case "Peon":
        npcState.hitPoints = 120;           // Don't be mistaken, attacking the townsfolk is a bad idear
        npcState.speed = 8;                 // update every 8 frames
        npcState.maxRadiusFromStart = 4;    // how many steps from startX/startY may the Peon walk
        npcState.agro = 0;                  // agro level, increments on any aggression
        npcState.agroThreshold = 1;         // any attacks on Peons cause them to turn monster
        break;

      case "Rat":
        npcState.hitPoint = 6;
        npcState.speed = 10;                // update every 10 frames
        npcState.maxRadiusFromStart = 1/0;
        npcState.agro = 1;                  // immediately make him agro
        npcState.agroThreshold = 0;
        npcState.isMonster = true;
        npcState.monsterStrategy = "Creepy";
        break;
    }

    cosmos.npcStates.push(npcState);

    cosmos.actionsTaken.push(`  NPC placed '${npcName}'`);
  }
}
