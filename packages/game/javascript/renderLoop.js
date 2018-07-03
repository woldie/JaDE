"use strict";

import * as PIXI from "pixi.js";

var injector = require("jsuice");

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

export default injector.annotateConstructor(RenderLoop, injector.PROTOTYPE_SCOPE, "animationFrameObservable");
