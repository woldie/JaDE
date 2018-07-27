import GameEventHandler from "./gameEventHandler";

export default class ResizePixiCanvas extends GameEventHandler {
  /**
   * @param {PIXI.Application} pixiApp
   */
  constructor(pixiApp) {
    super();

    /**
     * @name ResizePixiCanvas#pixiApp
     * @type {PIXI.Application}
     */
    this.pixiApp = pixiApp;
  }

  onFrame(frameTime, frameDelta, frameId, cosmos) {
    if(this.pixiApp.pixiContainer) {
      var containerWidth = this.pixiApp.pixiContainer.width();
      var containerHeight = this.pixiApp.pixiContainer.height();

      if(cosmos.canvasWidth !== containerWidth || cosmos.canvasHeight !== containerHeight) {
        this.pixiApp.renderer.resize(containerWidth, containerHeight);

        cosmos.canvasWidth = containerWidth;
        cosmos.canvasHeight = containerHeight;
      }
    }
  }
}
