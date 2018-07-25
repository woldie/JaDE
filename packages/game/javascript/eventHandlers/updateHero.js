import filter from "lodash.filter";
import find from "lodash.find";
import startsWith from "lodash.startswith"

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
    }

    // process any teleports here
    if(cosmos.commands.teleportTo) {
      var justTeleportTos = filter(currentAreaMap.objects, (obj) => /(teleport-to|climb-to).*/.test(obj.type));
      var teleportPoint = find(justTeleportTos, (obj) => obj.name === cosmos.commands.teleportTo.objectName);
      if(!teleportPoint) {
        this.criticalError(`MAP ERROR in area ${cosmos.playerState.currentArea}: missing teleport`, cosmos.commands.teleportTo);
      }
      else {
        heroSprite.x = Utils.normalizeCoord(teleportPoint.x);
        heroSprite.y = Utils.normalizeCoord(teleportPoint.y);

        cosmos.actionsTaken.push(`Hero teleports to ${cosmos.commands.teleportTo}: ${heroSprite.x}, ${heroSprite.y}`);
      }
      delete cosmos.commands.teleportTo;
    }

    // process climb commands
    if(cosmos.commands.climb) {
      var justClimbFrom = filter(currentAreaMap.objects, (obj) => startsWith(obj.type, "climb-to-"));
      var climbPoint = find(justClimbFrom, (obj) =>
          Utils.normalizeCoord(obj.x) === heroSprite.x && Utils.normalizeCoord(obj.y) === heroSprite.y);

      delete cosmos.commands.climb;

      if(climbPoint) {
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
    }

    // keyboard entry
    if(cosmos.playerState.up) {
      heroSprite.y -= 32;
      cosmos.actionsTaken.push(`Hero up`);
    }
    if(cosmos.playerState.down) {
      heroSprite.y += 32;
      cosmos.actionsTaken.push(`Hero down`);
    }
    if(cosmos.playerState.left) {
      heroSprite.x -= 32;
      cosmos.actionsTaken.push(`Hero left`);
    }
    if(cosmos.playerState.right) {
      heroSprite.x += 32;
      cosmos.actionsTaken.push(`Hero right`);
    }
  }
}
