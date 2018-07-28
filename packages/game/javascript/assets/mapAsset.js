import Asset from "./asset"

/**
 * Map asset - map and associated tileset bitmap.
 */
class MapAsset extends Asset {
  /**
   * @param {String} name filename (sans .json extension) of the Tiled map JSON file to load, serves as identifier
   * @param {String} tilesetName filename (sans .png extension) of the tileset PNG file to load
   */
  constructor(name, tilesetName) {
    super(name);

    /**
     * @name MapAsset#tilesetName
     * @type {String}
     */
    this.tilesetName = tilesetName;

    /**
     * @name MapAsset#areaMap
     * @type {(null|PIXI.Container)}
     */
    this.areaMap = null;

    /**
     * @name MapAsset#tileset
     * @type {(null|PIXI.Texture)}
     */
    this.tileset = null;

    /**
     * @name MapAsset#tilesetDescriptor
     * @type {(null|Object)}
     */
    this.tilesetDescriptor = null;

    /**
     * @name {MapAsset#width}
     * @type {number}
     */
    this.width = 0;

    /**
     * @name {MapAsset#height}
     * @type {number}
     */
    this.height = 0;
  }

  getType() {
    return "MapAsset";
  }
}

export default MapAsset;
