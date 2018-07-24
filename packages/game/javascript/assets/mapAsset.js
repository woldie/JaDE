"use strict";

import Asset from "./asset"

/**
 * Map asset - map and associated tileset bitmap.
 *
 * @param {String} name filename (sans .json extension) of the Tiled map JSON file to load, serves as identifier
 * @param {String} tilesetName filename (sans .png extension) of the tileset PNG file to load
 * @constructor
 * @extends {Asset}
 */
function MapAsset(name, tilesetName) {
  Asset.call(this, name);

  /**
   * @name MapAsset#tilesetName
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

  /**
   * @name MapAsset#tilesetDescriptor
   * @type {(null|Object)}
   */
  this.tilesetDescriptor = null;

  /**
   * @name {MapAsset#width}
   * @type {number}
   */
  this.width = 0;

  /**
   * @name {MapAsset#height}
   * @type {number}
   */
  this.height = 0;

  /**
   * @name MapAsset#camera
   * @type {(null|Camera)}
   */
  this.camera = null;
}

MapAsset.prototype = Object.create(Asset.prototype);

export default MapAsset;
