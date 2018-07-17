"use strict";

/**
 * @abstract
 * @constructor
 * @param {String} name asset's identifier
 */
function Asset(name) {
  /**
   * @name MapAsset#name
   * @type {String}
   */
  this.name = name;
}



export default Asset;
