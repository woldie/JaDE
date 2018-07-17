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
  var PIXI = this.PIXI,
    loadedTexture = /** @type {PIXI.Texture} */ allPixiLoadedResources[animatedSpriteAsset.name],
    textureList = [],
    textureFragment,
    i, ii, j, jj;

  // expect that loadedTexture is a horizontal strip containing 16x16 tiled graphics representing the animation frames
  for(i = 0, ii = animatedSpriteAsset.frameDescriptions.length, j = 0; i < ii; i++) {
    for (jj = j + animatedSpriteAsset.frameDescriptions[i].frameCount; j < jj; j++) {
      textureFragment = PIXI.Texture.fromImage(animatedSpriteAsset.name);
      textureFragment.frame = new PIXI.Rectangle(j * 16, 0, 16, 16);
      textureList.push(textureFragment);
    }
  }

  animatedSpriteAsset.sprite = new PIXI.extras.AnimatedSprite(textureList);
};

/**
 * @package
 * @param {AnimatedSpriteAsset} animatedSpriteAsset
 */
AnimatedSpriteAssetLoader.prototype.getSpritePng = function(animatedSpriteAsset) {
  return require(`../../sprites/${animatedSpriteAsset.name}.png`);
};

export default injector.annotateConstructor(AnimatedSpriteAssetLoader, injector.SINGLETON_SCOPE, "PIXI");
