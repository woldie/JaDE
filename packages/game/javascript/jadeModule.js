"use strict";

import { injector } from "jsuice";
import * as Rx from "rxjs";
import * as PIXI from "pixi.js";
import keyboardJs from "keyboardjs";

import provideAnimationFrameObservable from "./animationFrameObservable";
import provideTiledUtils from "./tiledUtils";
import providePixiApplication from "./pixiApplication";
import MapAssetLoader from "./assets/mapAssetLoader";
import AnimatedSpriteAssetLoader from "./assets/animatedSpriteAssetLoader";
import AssetManager from "./assetManager";
import Display from "./display";
import GameLoop from "./gameLoop";
import Keymap from "./keymap";
import TextIo from "./textIo";
import Init from "./init";

injector.newModuleGroup("jade", [
  "animationFrameScheduler", Rx.animationFrameScheduler,
  "animationFrameObservable", provideAnimationFrameObservable,
  "gameLoop", GameLoop,
  "init", Init,
  "tiledUtils", provideTiledUtils,
  "PIXI", PIXI,
  "pixiApp", providePixiApplication,
  "mapAssetLoader", MapAssetLoader,
  "animatedSpriteAssetLoader", AnimatedSpriteAssetLoader,
  "assetManager", AssetManager,
  "display", Display,
  "keyboardJs", keyboardJs,
  "keymap", Keymap,
  "textIo", TextIo
]);
