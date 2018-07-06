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

function RenderLoop(animationFrameObservable) {
  /**
   * @name RenderLoop#animationFrameObservable
   * @type {Rx.Observable}
   */
  this.animationFrameObservable = animationFrameObservable;

  /**
   * @name RenderLoop#frameId
   * @type {number}
   */
  this.frameId = 0;
}

RenderLoop.prototype.start = function() {
  var self = this;

  self.animationFrameObservable
    .subscribe(function(frameTime) {
      self.frameId++;
//      console.log("current frame: " + self.frameId + ", time: " + frameTime);
    });
};

export default injector.annotateConstructor(RenderLoop, injector.SINGLETON_SCOPE, "animationFrameObservable");
