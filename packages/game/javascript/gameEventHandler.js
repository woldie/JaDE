/**
 * @abstract
 */
export default class GameEventHandler {
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
   * @param {!Object} cosmos non-null Cosmos object
   */
  onFrame(frameTime, cosmos) {
  }

  /**
   * Called when stop() completes the shutdown of the GameLoop iff cosmos is not null.
   *
   * @param {Number} lastFrameTime start time of the last frame processed before the GameLoop was stop()'ed
   * @param {!Object} cosmos non-null Cosmos object
   */
  onStop(lastFrameTime, cosmos) {
  }
}
