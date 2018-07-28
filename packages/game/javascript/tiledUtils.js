/**
 * @license
 * JaDE - A roguelike game engine for HTML.
 * <br />Copyright (C) 2018  Woldrich, Inc.
 *
 * <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *   <img alt="Creative Commons License" style="border-width:0"
 *        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
 *   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *     Creative Commons Attribution-ShareAlike 4.0 International License
 *   </a>.
 */

"use strict";

import isUndefined from "lodash.isundefined";
import find from "lodash.find";
import filter from "lodash.filter";

import { injector } from "jsuice";
import * as PIXI from "pixi.js";

var _TileUtilities = require("tiled-utils");

import TileDescriptors from "../tilesets/Scavengers"

function provideTiledUtils() {
  var tiledUtils = new _TileUtilities(PIXI);

  /**
   * Get an attribute from the tiles and sprites at coordinates.
   *
   * Assumption: if you're calling to determine walkability for a sprite, you haven't already
   * moved that sprite to x/y as any sprite already at that location (including the one you're
   * testing for) will not be walkable.
   *
   * @this {TileUtilities}
   * @param {String} whichAttribute
   * @param {MapAsset} mapAsset
   * @param {number} x
   * @param {number} y
   * @returns {{attribute: string, value: (*|undefined), gidAtCoords: (undefined|number), x: number, y: number, spriteAtCoords: (undefined|*)}} the attribute at that position.  value is undefined if x or y are out of bounds of the map
   */
  tiledUtils.getGroundAttributeAtCoords = function(whichAttribute, mapAsset, x, y) {
    var returnVal = {
      attribute: whichAttribute,
      value: undefined,
      gidAtCoords: undefined,
      spriteAtCoords: undefined,
      x,
      y
    };

    if(x < 0 || y < 0 || x >= mapAsset.width || y >= mapAsset.height) {
      return returnVal; // not found
    }

    var tileIndex = this.getIndex(x, y, 32, 32, mapAsset.width / 32);

    var tile = mapAsset.areaMap.getObject("Ground").children[tileIndex];
    if(tileIndex <= 0 || isUndefined(tile)) {
      return returnVal; // not found
    }

    var tileInfo = find(TileDescriptors, (tileDescriptor) => tileDescriptor.id == tile.gid);

    returnVal.value = tileInfo[whichAttribute];
    if(isUndefined(returnVal.value)) {
      returnVal.value = false;
    }

    var sprites = mapAsset.areaMap.getObject("Sprites").children;
    var spriteOnTile = find(sprites, (sprite) => sprite.x === x && sprite.y === y);

    if(spriteOnTile) {
      // npc's and items always block you from moving through them
      if(whichAttribute === "walkable") {
        returnVal.value = false;
      }
    }

    returnVal.spriteAtCoords = !!spriteOnTile;
    returnVal.gidAtCoords = tile.gid;
    return returnVal;
  };

  return tiledUtils;
}

export default injector.annotateProvider(provideTiledUtils, injector.SINGLETON_SCOPE);
