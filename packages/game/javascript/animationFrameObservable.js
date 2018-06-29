"use strict";

var Rx = require("rxjs"),
  map = require("rxjs/operators").map,
  repeat = require("rxjs/operators").repeat,
  injector = require("jsuice");

function animationFrameObservable(animationFrameScheduler) {
  return Rx.defer(() =>
    Rx.of(animationFrameScheduler.now(), animationFrameScheduler)
      .pipe(
        repeat(),
        map((start) => animationFrameScheduler.now() - start)
      )
  );
}

module.exports = injector.annotateProvider(animationFrameObservable, injector.PROTOTYPE_SCOPE,
  "animationFrameScheduler");
