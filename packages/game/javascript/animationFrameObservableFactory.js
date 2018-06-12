"use strict";

var Rx = require("rxjs"),
  injector = require("jsuice");

function AnimationFrameObservableFactory(animationFrameScheduler) {
  /**
   * @name AnimationFrameObservableFactory#animationFrameScheduler
   * @type {Rx.Scheduler}
   */
  this.animationFrameScheduler = animationFrameScheduler;
}

AnimationFrameObservableFactory.prototype.create = function() {
  return Rx.interval(0, this.animationFrameScheduler);
};

module.exports = injector.annotateConstructor(AnimationFrameObservableFactory, injector.PROTOTYPE_SCOPE, "animationFrameScheduler");
