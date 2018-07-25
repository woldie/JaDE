import filter from "lodash.filter";
import find from "lodash.find";
import startsWith from "lodash.startswith"
import isUndefined from "lodash.isundefined"

import GameEventHandler from "./gameEventHandler";
import Constants from "../constants";
import Utils from "../utils";

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
    if((cosmos.playerState.idleFrames--) <= 0) {
      var actionTaken = this.processPlayerState(cosmos, currentAreaMap, heroSprite);

      // don't restart the player's action clock unless an action was actually taken
      if(actionTaken) {
        cosmos.playerState.idleFrames = cosmos.playerState.speed;
      }
      else {
        cosmos.playerState.idleFrames = 0;
      }
    }
  }

  processPlayerState(cosmos, currentAreaMap, heroSprite) {
    var actionTaken = false;

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

        cosmos.actionsTaken.push(`Hero teleports to ${cosmos.commands.teleportTo}: ${heroSprite.x}, ${heroSprite.y}`);
      }
      delete cosmos.commands.teleportTo;

      actionTaken = true;
    }

    // process climb commands
    else if (cosmos.commands.climb) {
      var justClimbFrom = filter(currentAreaMap.objects, (obj) => startsWith(obj.type, "climb-to-"));
      var climbPoint = find(justClimbFrom, (obj) =>
      Utils.normalizeCoord(obj.x) === heroSprite.x && Utils.normalizeCoord(obj.y) === heroSprite.y);

      delete cosmos.commands.climb;

      if (climbPoint) {
        var climbToGroups = /climb-to-(.*)/.exec(climbPoint.type);

        cosmos.commands.changeArea = {
          name: climbToGroups[1],
          nextCycle: true
        };
        cosmos.commands.teleportTo = {
          objectName: climbPoint.name,
          nextCycle: true
        };

        cosmos.actionsTaken.push(`Hero climbs to ${climbToGroups}, teleporter ${climbPoint.name}`);
      }
      else {
        // TODO: give some message to the user that the climb failed
      }

      actionTaken = true;
    }

    // keyboard entry
    else {
      if (cosmos.playerState.up) {
        heroSprite.y -= 32;
        cosmos.actionsTaken.push(`Hero up`);

        actionTaken = true;
      }
      if (cosmos.playerState.down) {
        heroSprite.y += 32;
        cosmos.actionsTaken.push(`Hero down`);

        actionTaken = true;
      }
      if (cosmos.playerState.left) {
        heroSprite.x -= 32;
        cosmos.actionsTaken.push(`Hero left`);

        actionTaken = true;
      }
      if (cosmos.playerState.right) {
        heroSprite.x += 32;
        cosmos.actionsTaken.push(`Hero right`);

        actionTaken = true;
      }
    }

    // make sure player state is up to date with sprite
    cosmos.playerState.x = heroSprite.x;
    cosmos.playerState.y = heroSprite.y;

    return actionTaken;
  }

  initPlayerStateIfNecc(cosmos) {
    if(isUndefined(cosmos.playerState.speed)) {
      cosmos.playerState.speed = 6;
    }
    if(isUndefined(cosmos.playerState.idleFrames)) {
      cosmos.playerState.idleFrames = 0;
    }
  }
}
