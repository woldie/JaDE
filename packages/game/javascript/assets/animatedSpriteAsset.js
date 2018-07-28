"use strict";

import Asset from "./asset"

/**
 * @typedef {Array.<{frameset: String, frameCount: Number}>} FrameDescriptions
 */

/**
 * Animated Sprite asset - bitmap that gets sliced and diced into animation frames and returned as a
 * PIXI.extras.AnimatedSprite.
 */
export default class AnimatedSpriteAsset extends Asset {
  /**
   * @param {String} name filename (sans .png extension) of the sprite PNG file to load, serves as identifier as well
   */
  constructor(name) {
    super(name);

    /**
     * @name AnimatedSpriteAsset#frameDescriptions
     * @type {FrameDescriptions}
     */
    this.frameDescriptions = this.loadFrameDescriptions();
  }

  /**
   * @private
   * @returns {FrameDescriptions}
   */
  loadFrameDescriptions() {
    return require(`../../sprites/${this.name}.js`);
  }

  /**
   * @param {PIXI} PIXI
   * @param {String} name
   * @returns {PIXI.extras.AnimatedSprite}
   */
  createAnimatedSprite(PIXI, name) {
    var textureList = [],
      textureFragment,
      i, ii, j, jj;

    // expect that loadedTexture is a horizontal strip containing 32x32 tiled graphics representing the animation frames
    for (i = 0, ii = this.frameDescriptions.length, j = 0; i < ii; i++) {
      for (jj = j + this.frameDescriptions[i].frameCount; j < jj; j++) {
        textureFragment = PIXI.Texture.fromImage(this.name);
        textureFragment.frame = new PIXI.Rectangle(j * 32, 0, 32, 32);
        textureList.push(textureFragment);
      }
    }

    var sprite = new PIXI.extras.AnimatedSprite(textureList);
    sprite.name = name;

    return sprite;
  }

  getType() {
    return "AnimatedSpriteAsset";
  }
}
