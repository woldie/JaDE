"use strict";

import Asset from "./asset"

/**
 * Animated Sprite asset - bitmap that gets sliced and diced into animation frames and returned as a
 * PIXI.extras.AnimatedSprite.
 *
 * @param {String} bitmapName filename (sans .png extension) of the sprite PNG file to load
 * @param {Array.<{frameset: String, frameCount: Number}>} frameDescriptions ordered set of frameset names and number of frames in set
 * @constructor
 * @extends {Asset}
 */
function AnimatedSpriteAsset(bitmapName, frameDescriptions) {
  Asset.call(this);

  /**
   * @name AnimatedSpriteAsset#bitmapName
   * @type {String}
   */
  this.bitmapName = bitmapName;

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
