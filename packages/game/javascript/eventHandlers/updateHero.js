import map from "lodash.map";
import filter from "lodash.filter";
import find from "lodash.find";
import startsWith from "lodash.startswith"
import isUndefined from "lodash.isundefined"
import remove from "lodash.remove"

import MapAsset from "../assets/mapAsset";
import GameEventHandler from "./gameEventHandler";
import Constants from "../constants";
import Utils from "../utils"
var isTruthy = Utils.isTruthy;

var UPDATE_HERO_TYPE = "UpdateHero";

/**
 * Ensures that the current area has the hero sprite added to the Sprites at the correct location
 */
export default class UpdateHero extends GameEventHandler {
  /**
   *
   * @param {Display} display
   * @param {PIXI} PIXI
   * @param {TileUtilities} tiledUtils
   * @param {TextIo} textIo
   * @param {Array.<Asset>} assets
   */
  constructor(display, PIXI, tiledUtils, textIo, assets) {
    super();

    this.type = UPDATE_HERO_TYPE;
    this.assets = assets;
    this.PIXI = PIXI;
    this.tiledUtils = tiledUtils;
    this.display = display;
    this.textIo = textIo;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    var currentArea = this.display.currentArea;
    if(!currentArea) {
      return;
    }

    var currentAreaMap = currentArea.areaMap;
    var spritesLayer = currentAreaMap.getObject("Sprites");
    var heroSprite = find(spritesLayer.children, (child) => child.name === Constants.HERO);

    if(!heroSprite) {
      var heroAsset = find(this.assets, (asset) =>
          asset.name === Constants.HERO);
      heroSprite = heroAsset.createAnimatedSprite(this.PIXI, Constants.HERO);
      spritesLayer.addChild(heroSprite);
      currentAreaMap.objects.push(heroSprite);

      this.initPlayerStateIfNecc(cosmos);
    }

    // make the player wait for the number of frames matching his speed
    var isActionFrame = (cosmos.playerState.idleFrames--) <= 0;

    var actionTaken = this.processPlayerState(frameId, cosmos, currentArea, heroSprite, isActionFrame);

    // don't restart the player's action clock unless an action was actually taken
    if(actionTaken) {
      cosmos.playerState.idleFrames = cosmos.playerState.speed;
    }
    else if(isActionFrame) {
      cosmos.playerState.idleFrames = 0;
    }
  }

  /**
   * @param {number} frameId
   * @param {Cosmos} cosmos
   * @param {MapAsset} currentArea
   * @param {PIXI.extras.AnimatedSprite} heroSprite
   * @param {boolean} isActionFrame is this a frame where player can take an action? (walk, attack, etc)
   */
  processPlayerState(frameId, cosmos, currentArea, heroSprite, isActionFrame) {
    var actionTaken = false;
    var currentAreaMap = currentArea.areaMap;

    // process any teleports here
    if (cosmos.commands.teleportTo) {
      var justTeleportTos = filter(currentAreaMap.objects, (obj) => /(teleport-to|climb-to).*/.test(obj.type));
      var teleportPoint = find(justTeleportTos, (obj) => obj.name === cosmos.commands.teleportTo.objectName);
      if (!teleportPoint) {
        this.criticalError(`MAP ERROR in area ${cosmos.playerState.currentArea}: missing teleport`, cosmos.commands.teleportTo);
      }
      else {
        heroSprite.x = Utils.normalizeCoord(teleportPoint.x);
        heroSprite.y = Utils.normalizeCoord(teleportPoint.y);

        cosmos.actionsTaken.push(`${frameId} Hero teleports to ${cosmos.commands.teleportTo}: ${heroSprite.x}, ${heroSprite.y}`);
      }
      delete cosmos.commands.teleportTo;

      actionTaken = true;
    }

    // process climb commands
    if (cosmos.commands.climb) {
      var justClimbFrom = filter(currentAreaMap.objects, (obj) => startsWith(obj.type, "climb-to-"));
      var climbPoint = find(justClimbFrom, (obj) =>
          Utils.normalizeCoord(obj.x) === heroSprite.x && Utils.normalizeCoord(obj.y) === heroSprite.y);

      delete cosmos.commands.climb;

      if (climbPoint) {
        var climbToGroups = /climb-to-(.*)/.exec(climbPoint.type);

        var targetArea = find(this.assets, (asset) => asset.name === climbToGroups[1]);

        if(targetArea) {
          cosmos.commands.changeArea = {
            name: climbToGroups[1],
            nextCycle: 1
          };
          cosmos.commands.teleportTo = {
            objectName: climbPoint.name,
            nextCycle: 1
          };

          cosmos.actionsTaken.push(`${frameId} Hero climbs to ${climbToGroups[1]}, teleporter ${climbPoint.name}`);

          this.textIo.setInputText(`[c]limb to ${climbToGroups[1]}`);
        }
      }
      else {
        // TODO: give some message to the user that the climb failed
      }

      actionTaken = true;
    }

    if(cosmos.commands.popToNextArea) {
      cosmos.commands.popToNextArea = false;

      var allMaps = filter(this.assets, (asset) => asset instanceof MapAsset);
      var mapNames = map(allMaps, (aMap) => aMap.name);
      var currentMapIndex = mapNames.indexOf(cosmos.playerState.currentArea);
      var nextMapIndex = currentMapIndex + 1;
      if (nextMapIndex >= mapNames.length) {
        nextMapIndex = 0;
      }

      cosmos.commands.changeArea = {
        name: mapNames[nextMapIndex],
        nextCycle: 1
      };
      cosmos.commands.teleportTo = {
        objectName: "StartingPoint",
        nextCycle: 1
      };

      cosmos.actionsTaken.push(`${frameId} Programmer pops to ${mapNames[nextMapIndex]}`);

      this.textIo.setInputText(`[p]op to ${mapNames[nextMapIndex]}`);
    }

    // process keyboard entry
    if(isActionFrame) {
      var tileInfo;

      var desiredX = heroSprite.x;
      if(cosmos.playerState.left) {
        desiredX -= 32;
      }
      if(cosmos.playerState.right) {
        desiredX += 32;
      }

      var desiredY = heroSprite.y;
      if(cosmos.playerState.up) {
        desiredY -= 32;
      }
      if(cosmos.playerState.down) {
        desiredY += 32;
      }

      this.tryToKillSprite(currentArea, heroSprite, desiredX, desiredY, cosmos);

      if (cosmos.playerState.up) {
        tileInfo = this.tiledUtils.getGroundAttributeAtCoords("walkable", currentArea, heroSprite.x, heroSprite.y - 32);
        if (isTruthy(tileInfo.value)) {
          heroSprite.y -= 32;
          cosmos.actionsTaken.push(`Hero up`);
        }
        else {
          cosmos.actionsTaken.push(`Hero blocked (up): ${JSON.stringify(tileInfo, null, "")}`);
        }

        actionTaken = true;
      }
      if (cosmos.playerState.down) {
        tileInfo = this.tiledUtils.getGroundAttributeAtCoords("walkable", currentArea, heroSprite.x, heroSprite.y + 32);
        if (isTruthy(tileInfo.value)) {
          heroSprite.y += 32;
          cosmos.actionsTaken.push(`Hero down`);
        }
        else {
          cosmos.actionsTaken.push(`Hero blocked (down): ${JSON.stringify(tileInfo, null, "")}`);
        }

        actionTaken = true;
      }
      if (cosmos.playerState.left) {
        tileInfo = this.tiledUtils.getGroundAttributeAtCoords("walkable", currentArea, heroSprite.x - 32, heroSprite.y);
        if (isTruthy(tileInfo.value)) {
          heroSprite.x -= 32;
          cosmos.actionsTaken.push(`Hero left`);
        }
        else {
          cosmos.actionsTaken.push(`Hero blocked (left): ${JSON.stringify(tileInfo, null, "")}`);
        }

        actionTaken = true;
      }
      if (cosmos.playerState.right) {
        tileInfo = this.tiledUtils.getGroundAttributeAtCoords("walkable", currentArea, heroSprite.x + 32, heroSprite.y);
        if (isTruthy(tileInfo.value)) {
          heroSprite.x += 32;
          cosmos.actionsTaken.push(`Hero right`);
        }
        else {
          cosmos.actionsTaken.push(`Hero blocked (right): ${JSON.stringify(tileInfo, null, "")}`);
        }

        actionTaken = true;
      }
    }

    // make sure player state is up to date with sprite
    cosmos.playerState.x = heroSprite.x;
    cosmos.playerState.y = heroSprite.y;

    return actionTaken;
  }

  tryToKillSprite(currentArea, heroSprite, desiredX, desiredY, cosmos) {
    var surroundingSprites = this.tiledUtils.getSurroundingSpritesAtCoords(currentArea, heroSprite.x, heroSprite.y);

    var spriteOnDesiredSpot = find(surroundingSprites, (surroundingSprite) =>
        surroundingSprite.x === desiredX && surroundingSprite.y === desiredY);

    if(spriteOnDesiredSpot) {
      var npcState = find(cosmos.npcStates, (npcState) => npcState.x === spriteOnDesiredSpot.x && npcState.y === spriteOnDesiredSpot.y);

      if(npcState.isMonster) {
        this.textIo.addOutputLine(`<span style="color: blue">HERO</span> attacks ${npcState.name} for ${Math.floor(40 * Math.random())} and kills it!`);

        remove(cosmos.npcStates, (npcState) => npcState.x === spriteOnDesiredSpot.x && npcState.y === spriteOnDesiredSpot.y);
        spriteOnDesiredSpot.destroy();
      }
    }
  }

  initPlayerStateIfNecc(cosmos) {
    if(isUndefined(cosmos.playerState.speed)) {
      cosmos.playerState.speed = 6;
      cosmos.actionsTaken.push(`playerState.speed initialized to ${cosmos.playerState.speed}`);
    }
    if(isUndefined(cosmos.playerState.idleFrames)) {
      cosmos.playerState.idleFrames = 0;
      cosmos.actionsTaken.push(`playerState.idleFrames initialized to ${cosmos.playerState.idleFrames}`);
    }
  }
}
