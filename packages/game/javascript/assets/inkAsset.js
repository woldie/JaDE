import Asset from "./asset"

/**
 * Map asset - map and associated tileset bitmap.
 *
 * @param {String} name filename (sans .json extension) of the Tiled map JSON file to load, serves as identifier
 * @param {String} tilesetName filename (sans .png extension) of the tileset PNG file to load
 * @constructor
 * @extends {Asset}
 */
export default class InkAsset extends Asset {
  constructor(name) {
    super(name);

    /**
     * @name InkAsset#inkScript
     * @type {(null|Object)}
     */
    this.inkScript = null;
  }

  getType() {
    return "InkAsset";
  }
}

