"use strict";

var Rx = require("rx"),
  injector = require("jsuice"),

  RenderLoop = require("./renderLoop"),
  AnimationFrameObservableFactory = require("./animationFrameObservableFactory");

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.Scheduler.animationFrame,
  "animationFrameObservableFactory", AnimationFrameObservableFactory,
  "RenderLoop", RenderLoop
]);
