"use strict";

import GameLoop from "./gameLoop";
import * as RxTesting from "rxjs/testing";

describe("gameLoop", function() {
  /** @type {GameLoop} */
  var gameLoop,
    /** @type {TestScheduler} */
    mockScheduler;

  beforeEach(function() {
    mockScheduler = new RxTesting.TestScheduler();
  });

  it("[start] will not increment the frameId only while the gameLoop is paused", function() {
    // create a mock hot observable that simulates the request animation frame event firing
    gameLoop = new GameLoop(mockScheduler.createHotObservable("----a---b----"));

    gameLoop.isPaused = true;
    gameLoop.start();

    mockScheduler.flush();

    expect.equals(0, gameLoop.frameId, "FrameID never advanced because the gameLoop was paused");
  });

  it("[setCosmos] process() will not be called unless a cosmos is set", function() {
    // create a mock hot observable that simulates the request animation frame event firing
    gameLoop = new GameLoop(mockScheduler.createHotObservable("----x---x----"));

    // given a preProcessCb callback that changes the cosmos
    gameLoop.preProcessCb = function() {
      var newCosmos = {};

      this.changeCosmos(newCosmos);

      expect.isSameReference(this.nextCosmos, newCosmos, "next cosmos set");

      // clear the preProcessCb so it doesn't get called again
      this.preProcessCb = null;
    };

    // and fake process function that we can watch to see if it gets called
    var fakeProcess = sinon.fake();
    sinon.replace(gameLoop, "process", fakeProcess);

    // when we start the GameLoop and flush the mock scheduler
    gameLoop.start();
    mockScheduler.flush();

    // then the process will get called only once
    expect.equals(1, fakeProcess.callCount, "process() only gets called once because a cosmos only existed at the start of the second frame");
  });

  it("[start] will increment the frameId every time there is an animationFrame page flip", function() {
    // create a mock hot observable that simulates the request animation frame event firing
    gameLoop = new GameLoop(mockScheduler.createHotObservable("----a----b----"));

    gameLoop.changeCosmos({});

    gameLoop.start();

    mockScheduler.flush();

    expect.equals(2, gameLoop.frameId, "FrameID advanced twice because the scheduler fired twice");
  });

  it("[start] will skip processing a frame if the frameTimeDelta is less than GameLoop.MINIMUM_FRAME_TIME", function() {
    // create a mock hot observable that simulates the request animation frame event firing,
    // the frameTime values are always increasing, which is why they are shown to accumulate the way they are
    // Frame b is less-than GameLoop.MINIMUM_FRAME_TIME, so that's the one that should be skipped.
    gameLoop = new GameLoop(mockScheduler.createHotObservable("----a-b-c-d--", {
      "a": 0,
      "b": 0 + (GameLoop.MINIMUM_FRAME_TIME-1),
      "c": 0 + (GameLoop.MINIMUM_FRAME_TIME-1) + (GameLoop.MINIMUM_FRAME_TIME),
      "d": 0 + (GameLoop.MINIMUM_FRAME_TIME-1) + (GameLoop.MINIMUM_FRAME_TIME) + (GameLoop.MINIMUM_FRAME_TIME + 1)
    }));

    // and we set the nextCosmos before we start
    gameLoop.changeCosmos({});

    // when we start the GameLoop and flush the mock scheduler
    gameLoop.start();
    mockScheduler.flush();

    expect.equals(3, gameLoop.frameId, "FrameID advanced only twice because frame b's delta was less than MINIMUM_FRAME_TIME");
  });

  it("[start] will call preProcessCb if it is non-null before process whenever the game loop is not paused", function() {
    // create a mock hot observable that simulates the request animation frame event firing
    gameLoop = new GameLoop(mockScheduler.createHotObservable("----a---b----"));

    // given a preProcessCb callback that pauses the GameLoop
    var preProcessCalls = 0;
    gameLoop.preProcessCb = function() {
      preProcessCalls++;
      this.isPaused = true;
    };

    // and fake process function that we can watch
    var fakeProcess = sinon.fake();
    sinon.replace(gameLoop, "process", fakeProcess);

    // and we set the nextCosmos before we start
    gameLoop.changeCosmos({});

    // when we start the GameLoop and flush the mock scheduler
    gameLoop.start();
    mockScheduler.flush();

    expect.equals(1, preProcessCalls, "preProcessCb only gets called once since it paused the second time");
    expect.equals(1, fakeProcess.callCount, "process() got called even though isPaused transitioned to true in the first iteration");
  });
});
