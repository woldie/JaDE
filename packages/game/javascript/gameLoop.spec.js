"use strict";

import GameLoop from "./gameLoop";
import GameEventHandler from "./eventHandlers/gameEventHandler";
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
    mockScheduler.run(({ hot }) => {
      // create a mock hot observable that simulates the request animation frame event firing
      gameLoop = new GameLoop(hot("----a---b----|"));

      gameLoop.isPaused = true;
      gameLoop.start();

      mockScheduler.flush();

      expect.equals(0, gameLoop.frameId, "FrameID never advanced because the gameLoop was paused");
    });
  });

  it("[start] will fail if called more than once", function() {
    mockScheduler.run(({ hot }) => {
      // create a mock hot observable that simulates the request animation frame event firing
      gameLoop = new GameLoop(hot("----a---b----|"));

      gameLoop.start();

      expect.throws(function () {
        gameLoop.start();
      }, /Cannot start the GameLoop more than once/, "Cannot call start() more than once");
    });
  });

  it("[start] will increment the frameId every time there is an animationFrame page flip", function() {
    mockScheduler.run(({ hot }) => {
      // create a mock hot observable that simulates the request animation frame event firing
      gameLoop = new GameLoop(hot("-a---b--|"));

      gameLoop.changeCosmos({});

      gameLoop.start();

      mockScheduler.flush();

      expect.equals(2, gameLoop.frameId, "FrameID advanced twice because the scheduler fired twice");
    });
  });

  it("[start] will skip processing a frame if the frameTimeDelta is less than GameLoop.MINIMUM_FRAME_TIME", function() {
    mockScheduler.run(({ hot }) => {
      // create a mock hot observable that simulates the request animation frame event firing,
      // the frameTime values are always increasing, which is why they are shown to accumulate the way they are
      // Frame b is less-than GameLoop.MINIMUM_FRAME_TIME, so that's the one that should be skipped.
      gameLoop = new GameLoop(hot("----a-b-c-d--|", {
        "a": 0,
        "b": 0 + (GameLoop.MINIMUM_FRAME_TIME - 1),
        "c": 0 + (GameLoop.MINIMUM_FRAME_TIME - 1) + (GameLoop.MINIMUM_FRAME_TIME),
        "d": 0 + (GameLoop.MINIMUM_FRAME_TIME - 1) + (GameLoop.MINIMUM_FRAME_TIME) + (GameLoop.MINIMUM_FRAME_TIME + 1)
      }));

      // and we set the nextCosmos before we start
      gameLoop.changeCosmos({});

      // when we start the GameLoop and flush the mock scheduler
      gameLoop.start();
      mockScheduler.flush();

      expect.equals(3, gameLoop.frameId, "FrameID advanced only thrice because frame b's delta was less than MINIMUM_FRAME_TIME");
    });
  });

  it("[start] will call preProcessCb if it is non-null before process whenever the game loop is not paused", function() {
    mockScheduler.run(({ hot }) => {
      // create a mock hot observable that simulates the request animation frame event firing
      gameLoop = new GameLoop(hot("----a---b----"));

      // given a preProcessCb callback that pauses the GameLoop
      var preProcessCalls = 0;
      gameLoop.preProcessCb = function () {
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
      expect.equals(2, fakeProcess.callCount, "process() got called even though isPaused transitioned to true in the first iteration");
      expect.equals("onStart", fakeProcess.getCall(0).lastArg, "onStart was the first call to process");
      expect.equals("onFrame", fakeProcess.getCall(1).lastArg, "onFrame was the second (and last) call to process");
    });
  });

  class MyEventHandler extends GameEventHandler {
    constructor() {
      super();

      this.onStartCalls = 0;
      this.onFrameCalls = 0;
      this.onStopCalls = 0;
    }

    onStart(frameTime, cosmos) {
      this.onStartCalls++;
    }

    onFrame(frameTime, frameDelta, frameId, cosmos) {
      this.onFrameCalls++;
    }

    onStop(lastFrameTime, cosmos) {
      this.onStopCalls++;
    }
  }

  it("[start] will allow you to pass event handlers that get called on major lifecycle events", function() {
    mockScheduler.run(({ hot }) => {
      // given a mock hot observable that simulates the request animation frame event firing
      gameLoop = new GameLoop(hot("-x-x-x-x-x-x-"));

      // and we set the nextCosmos before we start
      gameLoop.changeCosmos({});

      // and a postProcessCb callback that stops the GameLoop after onFrame has been called 3 times
      gameLoop.postProcessCb = function () {
        if (eventHandler.onFrameCalls === 3) {
          gameLoop.stop();
        }
      };

      // when we start the GameLoop with event handlers and flush the mock scheduler
      var eventHandler = new MyEventHandler();
      gameLoop.start([eventHandler]);
      mockScheduler.flush();

      // then a lot of stuff happens in the event handlers and GameLoop state
      expect.equals(1, eventHandler.onStartCalls, "onStart called once");
      expect.equals(3, eventHandler.onFrameCalls, "onFrame called three times");

      // then things are teardown gracefully as expected in GameLoop
      expect.equals(1, eventHandler.onStopCalls, "onStop called once");
    });
  });

  it("[setCosmos] process() will not call event handlers unless a cosmos is set", function() {
    mockScheduler.run(({ hot }) => {
      // create a mock hot observable that simulates the request animation frame event firing
      gameLoop = new GameLoop(hot("-x-x-x-x-x-x-"));

      // given that no cosmos is ever set
      gameLoop.changeCosmos(null);

      // and a postProcessCb callback that stops the GameLoop on the second frame
      gameLoop.postProcessCb = function () {
        if (gameLoop.frameId === 1) {
          gameLoop.stop();
        }
      };

      // when we start the GameLoop and flush the mock scheduler
      var eventHandler = new MyEventHandler();
      gameLoop.start([eventHandler]);
      mockScheduler.flush();

      // then the event handler will not be called for any of the lifecycle events
      expect.equals(0, eventHandler.onStartCalls, "onStart not called");
      expect.equals(0, eventHandler.onFrameCalls, "onFrame not called");
      expect.equals(0, eventHandler.onStopCalls, "onStop not called");
    });
  });
});
