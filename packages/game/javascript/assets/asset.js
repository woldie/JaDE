/**
 * @abstract
 */
export default class Asset {
  /**
   * @param {String} name asset's identifier
   */
  constructor(name) {
    /**
     * @name MapAsset#name
     * @type {String}
     */
    this.name = name;
  }

  getType() {
    throw new Error("Abstract base");
  }
}
