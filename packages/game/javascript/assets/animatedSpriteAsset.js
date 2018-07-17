"use strict";

import Asset from "./asset"

/**
 * Animated Sprite asset - bitmap that gets sliced and diced into animation frames and returned as a
 * PIXI.extras.AnimatedSprite.
 *
 * @param {String} name filename (sans .png extension) of the sprite PNG file to load, serves as identifier as well
 * @param {Array.<{frameset: String, frameCount: Number}>} frameDescriptions ordered set of frameset names and number of frames in set
 * @constructor
 * @extends {Asset}
 */
function AnimatedSpriteAsset(name, frameDescriptions) {
  Asset.call(this, name);

  /**
   * @name AnimatedSpriteAsset#frameDescriptions
   * @type {Array.<{frameset: String, frameCount: Number}>}
   */
  this.frameDescriptions = frameDescriptions;

  /**
   * @name AnimatedSpriteAsset#sprite
   * @type {(null|PIXI.AnimatedSprite)}
   */
  this.sprite = null;
}

AnimatedSpriteAsset.prototype = Object.create(Asset.prototype);

export default AnimatedSpriteAsset;
