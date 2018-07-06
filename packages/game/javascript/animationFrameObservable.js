"use strict";

import * as Rx from "rxjs";
import { map, repeat } from "rxjs/operators";
import { injector } from "jsuice";

function provideAnimationFrameObservable(animationFrameScheduler) {
  return Rx.defer(function() {
    Rx.of(animationFrameScheduler.now(), animationFrameScheduler).pipe(
      repeat(),
      map((start) => animationFrameScheduler.now() - start)
    )
  });
}

export default injector.annotateProvider(provideAnimationFrameObservable, injector.SINGLETON_SCOPE,
  "animationFrameScheduler");
