"use strict";

var Rx = require("rxjs"),
  injector = require("jsuice"),

  RenderLoop = require("./renderLoop"),
  animationFrameObservable = require("./animationFrameObservable");

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.animationFrameScheduler,
  "animationFrameObservable", animationFrameObservable,
  "RenderLoop", RenderLoop
]);
