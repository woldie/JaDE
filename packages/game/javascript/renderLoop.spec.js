"use strict";

var TestScheduler = require("rxjs/testing").TestScheduler,

  RenderLoop = require("./renderLoop");

describe("renderLoop", function() {
  /** @type {RenderLoop} */
  var renderLoop,
    /** @type {TestScheduler} */
    mockScheduler;

  beforeEach(function() {
    mockScheduler = new TestScheduler();
  });

  it("[start] will increment the frameId every time there is an animationFrame page flip", function() {
    // create a mock hot observable that simulates the request animation frame event firing
    renderLoop = new RenderLoop({ create: () => mockScheduler.createHotObservable("----a----b----") });

    renderLoop.start();

    mockScheduler.flush();

    expect.equals(2, renderLoop.frameId, "FrameID advanced twice because the scheduler fired twice")
  });
});
