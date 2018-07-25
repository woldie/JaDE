import { injector } from "jsuice";

import cloneDeep from "lodash.clonedeep"
import map from "lodash.map"

/**
 * @typedef {{name: string, combo: string, repeating: boolean, keyDown: function, keyUp: function}} ProfileEntry
 */

/**
 * @typedef {Array.<ProfileEntry>} KeymapProfile
 */

/**
 * Class for managing as stack of keyboard binding collections.  Used to map user input modes that are normally
 * logically nested (world traversal, go into conversation, return from conversation and world traversal should resume)
 */
class Keymap {
  /**
   * @param {Keyboard} keyboardJs
   */
  constructor(keyboardJs) {
    /**
     * @name Keymap#keyboardJs
     * @type {Keyboard}
     */
    this.keyboardJs = keyboardJs;

    /**
     * @name Keymap#profileStack
     * @type {Array.<KeymapProfile>}
     */
    this.profileStack = [];
  }

  /**
   * @param {KeymapProfile} profile
   */
  pushProfile(profile) {
    if(this.profileStack.length > 0) {
      this.clearCurrentProfile();
    }

    var clonedProfile = map(cloneDeep(profile), function(aKeyMap) {
      if(aKeyMap.repeating) {
        var origKeyDown = aKeyMap.keyDown;

        aKeyMap.keyDown = function (e) {
          e.preventRepeat();

          origKeyDown.call(this, e);
        }
      }
      return aKeyMap;
    });

    this.profileStack.push(clonedProfile);
    this.applyCurrentProfile();
  }

  popProfile() {
    if(this.profileStack.length > 0) {
      this.clearCurrentProfile();
      this.profileStack.pop();
    }

    if(this.profileStack.length > 0) {
      this.applyCurrentProfile();
    }
  }

  /**
   * @private
   */
  clearCurrentProfile() {
    var profileToClear = this.profileStack[this.profileStack.length-1];
    var i, ii;

    for(i = 0, ii = profileToClear.length; i < ii; i++) {
      var keyBinding = profileToClear[i];

      this.keyboardJs.unbind(keyBinding.combo, keyBinding.keyDown, keyBinding.keyUp);
    }
  }

  /**
   * @private
   */
  applyCurrentProfile() {
    var profileToSet = this.profileStack[this.profileStack.length-1];
    var i, ii;

    for(i = 0, ii = profileToSet.length; i < ii; i++) {
      var keyBinding = profileToSet[i];

      this.keyboardJs.bind(keyBinding.combo, keyBinding.keyDown, keyBinding.keyUp);
    }
  }
}

export default injector.annotateConstructor(Keymap, injector.SINGLETON_SCOPE, "keyboardJs");
