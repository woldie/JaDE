"use strict";

var Rx = require("rxjs"),
  map = require("rxjs/operators").map,
  repeat = require("rxjs/operators").repeat,
  injector = require("jsuice");

function createAnimationFrameObservable(animationFrameScheduler) {
  return Rx.of(animationFrameScheduler.now(), animationFrameScheduler)
    .pipe(
      repeat(),
      map((start) => animationFrameScheduler.now() - start)
    );
}

module.exports = injector.annotateProvider(createAnimationFrameObservable, injector.PROTOTYPE_SCOPE,
  "animationFrameScheduler");
