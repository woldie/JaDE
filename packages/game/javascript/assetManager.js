"use strict";

import { injector } from "jsuice";
import Promise from "bluebird";

import MapAsset from "./assets/mapAsset";
import AssetLoader from "./assets/assetLoader";

/**
 * @param {PIXI} PIXI
 * @param {MapAssetLoader} mapAssetLoader
 * @constructor
 */
function AssetManager(PIXI, mapAssetLoader) {
  /**
   * @name AssetManager#PIXI
   * @type {PIXI}
   */
  this.PIXI = PIXI;

  /**
   * @name AssetManager#mapAssetLoader
   * @type {MapAssetLoader}
   */
  this.mapAssetLoader = mapAssetLoader;
}

/**
 * Asynchronously load game asset data.
 *
 * @param {Array.<Asset>} assets game assets to load
 * @returns {Promise} Promise reporting success or failure to load assets using their AssetLoaders.  Resolved Promise
 * contains the array of Asset passed as parameters, filled out with loaded data to be further processed by the
 * caller.  Rejected Promise contains a string with descriptions of what failed to load.
 */
AssetManager.prototype.loadAll = function(assets) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var i, ii, asset, assetLoader;

    for(i = 0, ii = assets.length; i < ii; i++) {
      asset = assets[i];
      assetLoader = self.getLoaderForAsset(asset);
      assetLoader.prePixiLoad(asset);
    }

    self.PIXI.loader.load(function(loader, resources) {
      var j, jj, asset, assetLoader;

      for(j = 0, jj = assets.length; j < jj; j++) {
        asset = assets[j];
        assetLoader = self.getLoaderForAsset(asset);
        assetLoader.postPixiLoad(asset, resources);
      }

      resolve(assets);
    });
  });
};

/**
 * @package
 * @param {Asset} asset
 * @returns {AssetLoader}
 */
AssetManager.prototype.getLoaderForAsset = function(asset) {
  if(asset instanceof MapAsset) {
    return this.mapAssetLoader;
  }
  throw new Error("Unknown asset type");
};

export default injector.annotateConstructor(AssetManager, injector.SINGLETON_SCOPE, "PIXI", "mapAssetLoader");
