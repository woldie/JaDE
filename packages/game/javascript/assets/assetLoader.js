"use strict";

/**
 * Extend this class to handle specific asset type loads.
 * @abstract
 * @constructor
 */
function AssetLoader() {

}

/**
 * Any non-graphics loading/init'ing work or prepping of PIXI#load with PIXI#add calls should occur here.
 *
 * @param {Asset} asset Asset being loaded
 */
AssetLoader.prototype.prePixiLoad = function(asset) {
  throw new Error("abstract base");
};

/**
 * After PIXI#load completely finishes its work, any additional loading or initialization for this AssetLoader may
 * continue.
 *
 * @param {Asset} asset Asset being loaded
 * @param {Object.<String, *>} allLoadedPixiResources all resources that were loaded in the call to PIXI#load
 */
AssetLoader.prototype.postPixiLoad = function(asset, allLoadedPixiResources) {
  throw new Error("abstract base");
};

export default AssetLoader;
