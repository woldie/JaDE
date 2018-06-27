"use strict";

var Rx = require("rxjs"),
  injector = require("jsuice");

function animationFrameObservable(animationFrameScheduler) {
  return Rx.interval(0, animationFrameScheduler)
}

module.exports = injector.annotateProvider(animationFrameObservable, injector.PROTOTYPE_SCOPE,
  "animationFrameScheduler");
