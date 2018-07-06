"use strict";

import { injector } from "jsuice";
import * as Rx from "rxjs";
import * as PIXI from "pixi.js";

import provideAnimationFrameObservable from "./animationFrameObservable";
import provideTiledUtils from "./tiledUtils";
import provideJquery from "./jquery";
import RenderLoop from "./renderLoop";
import Init from "./init";

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.animationFrameScheduler,
  "animationFrameObservable", provideAnimationFrameObservable,
  "renderLoop", RenderLoop,
  "init", Init,
  "PIXI", PIXI,
  "$", provideJquery,
  "tiledUtils", provideTiledUtils
]);
