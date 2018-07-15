/**
 * @license
 * JaDE - A roguelike game engine for HTML.
 * <br />Copyright (C) 2018  Woldrich, Inc.
 *
 * <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *   <img alt="Creative Commons License" style="border-width:0"
 *        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
 *   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *     Creative Commons Attribution-ShareAlike 4.0 International License
 *   </a>.
 */

"use strict";

import { injector } from "jsuice";

/**
 * <h1>The Cosmos</h1>
 *
 * <p>There is a large, plain JavaScript object that contains the state of all maps, monsters, the player's state, and
 * the state of all NPC's, their conversations and trigger states, etc, etc that we call the Cosmos.  If we ever were
 * to support save states, we could save a subset of the Cosmos and use it to restore the world on subsequent load.
 * For now, we will use the Cosmos during development, giving ourselves a big, editable textarea that contains a
 * JSON.stringify'ed copy of Cosmos that gets regenerated every frame.  Until frame processing completes, we should
 * consider the Cosmos to be in-chaos and therefore inconsistent and unrecognizable.  As developers, we can only get
 * a stable picture of the Cosmos in-between frames and not during frame processing.
 *
 * <h1>Game frames and the game loop</h1>
 *
 * <p>The game loop is always running.  Each time game loop runs where game processing is done, the game displays are
 * updated and the Cosmos is updated is called a frame.  A frameId counter is incremented at the start of every frame.
 * The maximum rate that the game loop will process frames is ideally 60Hz, which is the typical frame rate of the
 * browser's display.  If the processing for a frame runs long, the framerate a user will observe will slow down, but
 * the game should still proceed normally nonetheless.  Ideally we can do all of our processing for a frame in 1/60th
 * of a second or less so that the framerate will always be at maximum for the user.
 *
 * <p>For the purposes of game development, the game loop can be paused using superuser tools we give ourselves.  When
 * the pause flag is set, the current frame will finish its processing and then the Cosmos should be in-order.  Frame
 * processing will then only continue at the start of a game loop when it finds that the pause flag is again disabled.
 * Having the ability to disable frame processing, and making the Cosmos JSON directly editable by the programmer,
 * will allow us to rig up testing scenarios that we can use to experiment with gameplay mechanics or during trigger
 * development.
 *
 * <p>One of the typical game design tenets of roguelikes is that world time stops at every turn to allow the player
 * to contemplate their next move.  Our engine will be able to skip processing for some elements of the world (like
 * graphics animations or NPC/Monster actions) to achieve this "time stop" effect while the player contemplates their
 * next move, but that is not the same as the pause flag discussed above.  The pause flag stops *all* processing in
 * the game loop and prevents the frameId from advancing and is primarily useful during game development.
 */
function GameLoop(animationFrameObservable) {
  /**
   * @name GameLoop#animationFrameObservable
   * @type {Rx.Observable}
   */
  this.animationFrameObservable = animationFrameObservable;

  /**
   * @name GameLoop#frameId
   * @type {number}
   */
  this.frameId = 0;

  /**
   * Everything that is and is known.
   *
   * @name GameLoop#cosmos
   * @type {(null|Object)}
   * @package
   */
  this.cosmos = null;

  /**
   * This value is intended to ensure that RequestAnimationFrame never consistently runs faster than 60Hz.
   * You should not use this value for any frame time delta calculations as the this value will not be updated
   * whenever the GameLoop is paused.
   *
   * <p>The initial value of this flag is NaN, which indicates that the first frame should not be compared with any
   * previous frame time (because there is none), which allows the first frame to always be rendered.
   *
   * @name GameLoop#lastFrameTime
   * @type {(NaN|number)}
   * @package
   */
  this.lastFrameTime = parseInt("NaN");

  /**
   * Is the game loop disabled?
   *
   * <p>This flag is intended for development purposes, and goes beyond merely "pausing" the
   * game.  Setting this to true is used to temporarily halt all processing, allow the developer to make game state
   * changes, and then set back to false to get the loop going again.
   *
   * <p>Pausing the game loop takes effect at the _start_ of the next potential game frame and not in the middle of
   * any currently running frame.
   *
   * @name GameLoop#isPaused
   * @type {boolean}
   * @package
   */
  this.isPaused = false;

  /**
   * When not null, this function is called just prior to calling process().  Useful for debugging.  The 'this'
   * is set to the calling GameLoop object when called.
   *
   * @type {(null|function(Number))}
   */
  this.preProcessCb = null;

  /**
   * When not null, prior to the start of the next frame, the cosmos will be replaced with this cosmos object and
   * then this will be set to null.
   *
   * @name GameLoop#nextCosmos
   * @type {(null|Object)}
   * @private
   */
  this.nextCosmos = null;
}

GameLoop.MINIMUM_FRAME_TIME = Math.floor(1000 / 60);

GameLoop.prototype.changeCosmos = function(newCosmos) {
  this.nextCosmos = newCosmos;
};

/**
 * Process a frame of the GameLoop
 *
 * @name GameLoop#process
 * @param {Number} frameTime
 * @package
 */
GameLoop.prototype.process = function(frameTime) {
  this.lastFrameTime = frameTime;
  this.frameId++;
};

GameLoop.prototype.start = function() {
  this.animationFrameObservable.subscribe((frameTime) => {
    var frameTimeDelta = frameTime - this.lastFrameTime;
    if(frameTimeDelta < GameLoop.MINIMUM_FRAME_TIME) {
      console.log(`Minimum frame delta is ${GameLoop.MINIMUM_FRAME_TIME} msec, skipping ${frameTimeDelta} msec frame`);
      return;
    }

    if(this.nextCosmos) {
      this.cosmos = this.nextCosmos;
      this.nextCosmos = null;
    }

    // test to see if the game loop is paused, and if so, skip the frame
    if(this.isPaused) {
      console.log(`GameLoop is paused, time: ${frameTime}`);
      return;
    }

    if(this.preProcessCb) {
      this.preProcessCb.call(this, frameTime);
    }
    if(this.cosmos) {
      this.process(frameTime);
    }
  });
};

export default injector.annotateConstructor(GameLoop, injector.SINGLETON_SCOPE, "animationFrameObservable");
