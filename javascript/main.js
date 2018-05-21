var PixiApplication = require("@pixi/app").Application,
  PixiUtils = require("@pixi/utils"),
  $ = require("jquery");

var app = new PixiApplication({
  width: 256,         // default: 800
  height: 256,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1,      // default: 1
  forceCanvas: PixiUtils.isWebGLSupported() ? "WebGL" : "canvas"
});

$(document.body).append(app.view);

app.renderer.backgroundColor = 0x061639;
