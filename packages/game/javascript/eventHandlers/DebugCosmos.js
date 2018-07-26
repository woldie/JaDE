import GameEventHandler from "./gameEventHandler";

import isEmpty from "lodash.isempty";
import forEach from "lodash.foreach";

/**
 * Catch all for any end-of-gameloop analysis or debugging of the state of the cosmos.
 */
export default class DebugCosmos extends GameEventHandler {
  onFrame(frameTime, frameDelta, frameId, cosmos) {
    if(cosmos.actionsTaken.length) {
      console.log(`${frameId} actions taken: `, cosmos.actionsTaken);
      cosmos.actionsTaken = [];
    }

    var unprocessedCount = 0;
    for(var c in cosmos.commands) {
      if(cosmos.commands.hasOwnProperty(c)) {
        var command = cosmos.commands[c];

        if (command.nextCycle <= 0) {
          unprocessedCount++;
        }
      }
    }

    if(unprocessedCount) {
      console.log(`${frameId} One or more commands were not fully processed!`, cosmos.commands);
      cosmos.commands = {};
    }

    // clear any nextCycle flags for commands we expect to be processed during the next frame
    forEach(cosmos.commands, (command) => {
      if(command.nextCycle > 0) {
        command.nextCycle--;
      }
    });
  }
}
