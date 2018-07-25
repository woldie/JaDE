"use strict";

import { injector } from "jsuice";
import AssetLoader from "./assetLoader"
import MapAsset from "./mapAsset"
import find from "lodash.find"
import remove from "lodash.remove";

/**
 * Asset loader for maps and associated tileset bitmaps.
 *
 * @param {PIXI} PIXI pixi namespace
 * @param {TileUtilities} tiledUtils jsuice injected TiledUtils instance
 * @param {Display} display game display object
 * @constructor
 * @extends {AssetLoader}
 */
function MapAssetLoader(PIXI, tiledUtils, display) {
  AssetLoader.call(this);

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

  /**
   * @name MapAssetLoader#display
   * @type {Display}
   */
  this.display = display;
}

MapAssetLoader.prototype = Object.create(AssetLoader.prototype);

/**
 * @param {MapAsset} mapAsset
 */
MapAssetLoader.prototype.prePixiLoad = function(mapAsset) {
  // only add the tileset asset if it hasn't already been queued up to be loaded
  if(!find(this.PIXI.loader.resources, (resource) => resource.name === mapAsset.tilesetName)) {
    this.PIXI.loader.add({
      name: mapAsset.tilesetName,
      url: this.getTilesetPng(mapAsset)
    });
  }
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

  var mapJson = this.getMapJson(mapAsset);
  mapAsset.areaMap = this.tiledUtils.makeTiledWorld(mapJson, mapAsset.tilesetName);

  // find the Ground layer and copy out the width and height for our records
  var groundTiledLayer = find(mapAsset.areaMap.children, (layer) => layer.name === "Ground");
  mapAsset.width = groundTiledLayer.width;
  mapAsset.height = groundTiledLayer.height;

  var i;
  groundTiledLayer = null;
  var layerContainers = mapAsset.areaMap.children;
  var objectContainers = mapAsset.areaMap.objects;
  for(i = layerContainers.length-1; i >= 0; i--) {
    if(layerContainers[i].name === "Ground") {
      groundTiledLayer = layerContainers[i];

      // add in the sprites layer right after the ground layer
      var spritesLayer = new this.PIXI.Container();
      spritesLayer.name = "Sprites";
      spritesLayer.opacity = 1;
      spritesLayer.type = "tilelayer";
      spritesLayer.visible = true;
      spritesLayer.x = 0;
      spritesLayer.y = 0;

      mapAsset.areaMap.addChildAt(spritesLayer, i+1);
      objectContainers.push(spritesLayer);
    }
    if(layerContainers[i].name === "Roof") {
      mapAsset.areaMap.removeChild(layerContainers[i]);
      remove(objectContainers, (obj) => obj.name === "Roof");
    }
  }

  mapAsset.tilesetDescriptor = this.getTilesetDescriptor(mapAsset);
  mapAsset.camera = this.display.makeCamera(mapAsset.areaMap, mapAsset.width, mapAsset.height);
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
 * @returns loaded tileset descriptor
 */
MapAssetLoader.prototype.getTilesetDescriptor = function(mapAsset) {
  return require(`../../tilesets/${mapAsset.tilesetName}.js`)
};

/**
 * @package
 * @param {MapAsset} mapAsset
 * @returns loaded map json
 */
MapAssetLoader.prototype.getMapJson = function(mapAsset) {
  return require(`../../maps/${mapAsset.name}.json`);
};

export default injector.annotateConstructor(MapAssetLoader, injector.SINGLETON_SCOPE, "PIXI", "tiledUtils", "display");
