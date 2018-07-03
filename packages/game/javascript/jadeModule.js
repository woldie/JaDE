"use strict";

import RenderLoop from "./renderLoop";

var Rx = require("rxjs"),
  injector = require("jsuice"),

  animationFrameObservable = require("./animationFrameObservable");

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.animationFrameScheduler,
  "animationFrameObservable", animationFrameObservable,
  "RenderLoop", RenderLoop
]);
