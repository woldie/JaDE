"use strict";

import { injector } from "jsuice";
import AssetLoader from "./assetLoader"
import AnimatedSpriteAsset from "./animatedSpriteAsset"

/**
 * Asset loader for animated sprites.
 *
 * @param {PIXI} PIXI pixi namespace
 * @constructor
 * @extends {AssetLoader}
 */
function AnimatedSpriteAssetLoader(PIXI) {
  AssetLoader.call(this);

  /**
   * @name AnimatedSpriteAssetLoader#PIXI
   * @type {PIXI}
   */
  this.PIXI = PIXI;
}

AnimatedSpriteAssetLoader.prototype = Object.create(AssetLoader.prototype);

/**
 * @param {AnimatedSpriteAsset} animatedSpriteAsset
 */
AnimatedSpriteAssetLoader.prototype.prePixiLoad = function(animatedSpriteAsset) {
  this.PIXI.loader.add({
    name: animatedSpriteAsset.name,
    url: this.getSpritePng(animatedSpriteAsset)
  });
};

/**
 * @param {AnimatedSpriteAsset} animatedSpriteAsset
 * @param {Object.<String, *>} allPixiLoadedResources
 */
AnimatedSpriteAssetLoader.prototype.postPixiLoad = function(animatedSpriteAsset, allPixiLoadedResources) {
};

/**
 * @package
 * @param {AnimatedSpriteAsset} animatedSpriteAsset
 */
AnimatedSpriteAssetLoader.prototype.getSpritePng = function(animatedSpriteAsset) {
  return require(`../../sprites/${animatedSpriteAsset.name}.png`);
};

export default injector.annotateConstructor(AnimatedSpriteAssetLoader, injector.SINGLETON_SCOPE, "PIXI");
