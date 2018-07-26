"use strict";

import { injector } from "jsuice";
import $ from "jquery";

/**
 * @param {PIXI} PIXI
 */
function providePixiApplication(PIXI) {
  console.log("Provide Pixi application");
  var pixiApp = new PIXI.Application({
    width: 2000,        // default: 800
    height: 10 * 32,    // default: 600
    antialias: false,   // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    forceCanvas: PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
  });

  pixiApp.renderer.autoResize = true;
  pixiApp.renderer.backgroundColor = 0x061639;

  /**
   * @name PIXI.Application#pixiContainer
   * @type {jQuery}
   */
  pixiApp.pixiContainer = $("<div class='pixiContainer'></div>").prependTo(document.body);
  pixiApp.pixiContainer.append(pixiApp.view);

  return pixiApp;
}

export default injector.annotateProvider(providePixiApplication, injector.SINGLETON_SCOPE, "PIXI");
