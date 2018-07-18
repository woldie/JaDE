"use strict";

var GAME_EVENT_HANDLER_TYPE = "GameEventHandler";

/**
 * @abstract
 */
export default class GameEventHandler {
  constructor() {
    /**
     * Identifies the type of the handler, for logging purposes.
     *
     * @name GameEventHandler#type
     * @type {string}
     */
    this.type = GAME_EVENT_HANDLER_TYPE;
  }

  /**
   * Called when start() is called on the GameLoop iff cosmos is not null
   *
   * @param {Number} frameTime this should be the time of the first frame processed.  The onStart event handlers are
   * called in the context of the first frame before any processing has occurred but immediately after any new cosmos
   * object has been accepted by the GameLoop as the current cosmos object
   * @param {!Object} cosmos the currently active non-null Cosmos object
   */
  onStart(frameTime, cosmos) {
  }

  /**
   * Called once per GameLoop frame iff cosmos is not null.
   *
   * @param {Number} frameTime start of frame time since number of milliseconds since start of program
   * @param {Number} frameDelta number of milliseconds since the last frame, will be 0 on the first frame
   * @param {Number} frameId incrementing number indicating which frame we're on
   * @param {!Object} cosmos non-null Cosmos object
   */
  onFrame(frameTime, frameDelta, frameId, cosmos) {
  }

  /**
   * Called when stop() completes the shutdown of the GameLoop iff cosmos is not null.
   *
   * @param {Number} lastFrameTime start time of the last frame processed before the GameLoop was stop()'ed
   * @param {!Object} cosmos non-null Cosmos object
   */
  onStop(lastFrameTime, cosmos) {
  }

  /**
   * Loud and obnoxious error for when things go wrong and then throws to bail out.
   *
   * @param {String} message message to be displayed as an alert and logged to the console log
   * @param {...*=} objectsToLog optional parameters that will be dumped to the console log
   */
  criticalError(message, objectsToLog) {
    var formattedMsg = `Failure in ${this.type}: ${message}`;
    alert(formattedMsg);
    console.log(formattedMsg);

    var args = Array.from(arguments),
      i, ii;

    for(i = 1, ii = args.length; i < ii; i++) {
      console.log(args[i]);
    }

    throw new Error("abort GameEventHandler");
  }
}
