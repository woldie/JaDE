"use strict";

import { injector } from "jsuice";
import * as Rx from "rxjs";

import provideAnimationFrameObservable from "./animationFrameObservable";
import provideTiledUtils from "./tiledUtils";
import RenderLoop from "./renderLoop";
import Init from "./init";

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.animationFrameScheduler,
  "animationFrameObservable", provideAnimationFrameObservable,
  "renderLoop", RenderLoop,
  "init", Init,
  "tiledUtils", provideTiledUtils
]);
