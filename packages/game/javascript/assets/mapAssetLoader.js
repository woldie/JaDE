"use strict";

import { injector } from "jsuice";
import AssetLoader from "./assetLoader"
import MapAsset from "./mapAsset"

/**
 * Asset loader for maps and associated tileset bitmaps.
 *
 * @param {PIXI} PIXI pixi namespace
 * @param {TileUtilities} tiledUtils jsuice injected TiledUtils instance
 * @constructor
 * @extends {AssetLoader}
 */
function MapAssetLoader(PIXI, tiledUtils) {
  /**
   * @name MapAssetLoader#tiledUtils
   * @type {TileUtilities}
   */
  this.tiledUtils = tiledUtils;

  /**
   * @name MapAssetLoader#PIXI
   * @type {PIXI}
   */
  this.PIXI = PIXI;
}

MapAssetLoader.prototype = Object.create(AssetLoader.prototype);

/**
 * @param {MapAsset} mapAsset
 */
MapAssetLoader.prototype.prePixiLoad = function(mapAsset) {
  this.PIXI.loader.add({
    name: mapAsset.tilesetName,
    url: this.getTilesetPng(mapAsset)
  });
};

/**
 * After PIXI#load is called, the tileset texture should be ready to be sliced and diced into tiles and used to
 * power sprites for a TiledWorld which will get loaded from its json.
 *
 * @param {MapAsset} mapAsset MapAsset being loaded
 * @param {Object.<String, *>} allPixiResources all resources that were loaded in the call to PIXI#load
 */
MapAssetLoader.prototype.postPixiLoad = function(mapAsset, allPixiResources) {
  mapAsset.tileset = allPixiResources[mapAsset.tilesetName];
  mapAsset.areaMap = this.tiledUtils.makeTiledWorld(this.getMapJson(mapAsset), mapAsset.tilesetName);
};

/**
 * @package
 * @param {MapAsset} mapAsset
 * @returns loaded png
 */
MapAssetLoader.prototype.getTilesetPng = function(mapAsset) {
  return require(`../../tilesets/${mapAsset.tilesetName}.png`);
};

/**
 * @package
 * @param {MapAsset} mapAsset
 * @returns loaded map json
 */
MapAssetLoader.prototype.getMapJson = function(mapAsset) {
  return require(`../../maps/${mapAsset.mapName}.json`);
};

export default injector.annotateConstructor(MapAssetLoader, injector.SINGLETON_SCOPE, "PIXI", "tiledUtils");
