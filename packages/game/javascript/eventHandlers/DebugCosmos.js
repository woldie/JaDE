import GameEventHandler from "./gameEventHandler";

import isEmpty from "lodash.isempty";

/**
 * Catch all for any end-of-gameloop analysis or debugging of the state of the cosmos.
 */
export default class DebugCosmos extends GameEventHandler {
  onFrame(frameTime, frameDelta, frameId, cosmos) {
    if(cosmos.actionsTaken.length) {
      console.log(`${frameId} actions taken: `, cosmos.actionsTaken);
      cosmos.actionsTaken = [];
    }

    if(!isEmpty(cosmos.commands)) {
      console.log(`${frameId} commands were not fully processed!`, cosmos.commands);
      cosmos.commands = {};
    }
  }
}
