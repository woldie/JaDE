"use strict";

import RenderLoop from "./renderLoop";
import * as RxTesting from "rxjs/testing";

describe("renderLoop", function() {
  /** @type {RenderLoop} */
  var renderLoop,
    /** @type {TestScheduler} */
    mockScheduler;

  beforeEach(function() {
    mockScheduler = new RxTesting.TestScheduler();
  });

  it("[start] will increment the frameId every time there is an animationFrame page flip", function() {
    // create a mock hot observable that simulates the request animation frame event firing
    renderLoop = new RenderLoop(mockScheduler.createHotObservable("----a----b----"));

    renderLoop.start();

    mockScheduler.flush();

    expect.equals(2, renderLoop.frameId, "FrameID advanced twice because the scheduler fired twice")
  });
});
