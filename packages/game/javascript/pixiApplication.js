"use strict";

import { injector } from "jsuice";
import $ from "jquery";

/**
 * @param {PIXI} PIXI
 */
function providePixiApplication(PIXI) {
  console.log("Provide Pixi application");
  var pixiApp = new PIXI.Application({
    width: 20 * 32,    // default: 800
    height: 20 * 32,   // default: 600
    antialias: false,   // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    forceCanvas: PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
  });

  pixiApp.renderer.autoResize = true;
  //pixiApp.renderer.resize(5000, 5000);
  pixiApp.renderer.backgroundColor = 0x061639;

  $(document.body).append(pixiApp.view);

  return pixiApp;
}

export default injector.annotateProvider(providePixiApplication, injector.SINGLETON_SCOPE, "PIXI");
