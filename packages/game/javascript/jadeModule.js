"use strict";

var Rx = require("rx"),
  injector = require("jsuice"),

  RenderLoop = require("./renderLoop"),
  animationFrameObservable = require("./animationFrameObservable");

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.Scheduler.animationFrame,
  "animationFrameObservable", animationFrameObservable,
  "RenderLoop", RenderLoop
]);
