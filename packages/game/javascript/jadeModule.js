"use strict";

import { injector } from "jsuice";
import * as Rx from "rxjs";
import * as PIXI from "pixi.js";

import provideAnimationFrameObservable from "./animationFrameObservable";
import provideTiledUtils from "./tiledUtils";
import MapAssetLoader from "./assets/mapAssetLoader";
import AnimatedSpriteAssetLoader from "./assets/animatedSpriteAssetLoader";
import AssetManager from "./assetManager";
import RenderLoop from "./renderLoop";
import Init from "./init";

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.animationFrameScheduler,
  "animationFrameObservable", provideAnimationFrameObservable,
  "renderLoop", RenderLoop,
  "init", Init,
  "tiledUtils", provideTiledUtils,
  "PIXI", PIXI,
  "mapAssetLoader", MapAssetLoader,
  "animatedSpriteAssetLoader", AnimatedSpriteAssetLoader,
  "assetManager", AssetManager
]);
