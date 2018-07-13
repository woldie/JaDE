"use strict";

import Asset from "./asset"

/**
 * Map asset - map and associated tileset bitmap.
 *
 * @param {String} mapName filename (sans .json extension) of the Tiled map JSON file to load
 * @param {String} tilesetName filename (sans .png extension) of the tileset PNG file to load
 * @constructor
 * @extends {Asset}
 */
function MapAsset(mapName, tilesetName) {
  Asset.call(this);

  /**
   * @name MapAsset#tilesetName
   * @type {String}
   */
  this.mapName = mapName;

  /**
   * @name MapAsset#mapName
   * @type {String}
   */
  this.tilesetName = tilesetName;

  /**
   * @name MapAsset#areaMap
   * @type {(null|PIXI.Container)}
   */
  this.areaMap = null;

  /**
   * @name MapAsset#tileset
   * @type {(null|PIXI.Texture)}
   */
  this.tileset = null;
}

MapAsset.prototype = Object.create(Asset.prototype);

export default MapAsset;
