import GameEventHandler from "./gameEventHandler";

import find from "lodash.find";

var UPDATE_AREA_TYPE = "UpdateArea";

/**
 * The purpose of this game event handler is to set the displayed area to the correct one listed in the cosmos and
 * then centering the view on the player location listed in the cosmos.
 *
 * Then onstop, any currently displayed view should be removed
 */
export default class UpdateArea extends GameEventHandler {
  constructor(display, assets) {
    super();
    this.type = UPDATE_AREA_TYPE;

    this.display = display;
    this.assets = assets;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    if(cosmos.commands.changeArea) {
      var newAreaName = cosmos.commands.changeArea.name;
      delete cosmos.commands.changeArea;

      var newAreaAsset = find(this.assets, (asset) => asset.name === newAreaName);

      if(!newAreaAsset) {
        this.criticalError(`Could not find area asset named ${newAreaName}`);
      }

      this.display.changeCurrentArea(newAreaAsset);

      cosmos.playerState.currentArea = newAreaName;
      cosmos.actionsTaken.push(`Area changed to '${newAreaName}'`);
    }
  }
}

