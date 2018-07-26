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
   * Get an attribute from the tiles and sprites at coordinates
   *
   * @this {TileUtilities}
   * @param {String} whichAttribute
   * @param {MapAsset} mapAsset
   * @param {number} x
   * @param {number} y
   * @returns {{attribute: string, value: *, gidAtCoords: number}} the attribute at that position or null if x and y are out of bounds of the map
   */
  tiledUtils.getGroundAttributeAtCoords = function(whichAttribute, mapAsset, x, y) {
    if(x < 0 || y < 0 || x >= mapAsset.width || y >= mapAsset.height) {
      return null;
    }

    var tileIndex = this.getIndex(x, y, 32, 32, mapAsset.width / 32);

    var tile = mapAsset.areaMap.getObject("Ground").children[tileIndex];

    var tileInfo = find(TileDescriptors, (tileDescriptor) => tileDescriptor.id == tile.gid);

    var attribute = tileInfo[whichAttribute];
    if(isUndefined(attribute)) {
      attribute = false;
    }

    var sprites = filter(mapAsset.areaMap.getObject("Sprites").children, (sprite) => sprite.name !== "Hero");
    var spriteOnTile = find(sprites, (sprite) => sprite.x === x && sprite.y === y);

    if(spriteOnTile) {
      // npc's and items always block you from moving through them
      if(whichAttribute === "walkable") {
        attribute = false;
      }
    }

    return {
      attribute: whichAttribute,
      value: attribute,
      gidAtCoords: tile.gid,
      spriteAtCoords: !!spriteOnTile,
      x,
      y
    };
  };

  return tiledUtils;
}

export default injector.annotateProvider(provideTiledUtils, injector.SINGLETON_SCOPE);
