import { injector } from "jsuice";
import AssetLoader from "./assetLoader"
import InkAsset from "./inkAsset"

/**
 * Asset loader for Inkjs scripts.
 */
class InkAssetLoader extends AssetLoader {
  constructor() {
    super();
  }

  /**
   * @param {InkAsset} inkAsset
   */
  prePixiLoad(inkAsset) {
  }

  /**
   * @param {InkAsset} inkAsset
   * @param {Object.<String, *>} allPixiResources
   */
  postPixiLoad(inkAsset, allPixiResources) {
    inkAsset.inkScript = require(`../../dialogue/${inkAsset.name}.json`);
  }
}

export default injector.annotateConstructor(InkAssetLoader, injector.SINGLETON_SCOPE);
