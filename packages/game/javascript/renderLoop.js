var injector = require("jsuice");

function RenderLoop(animationFrameObservable) {
  /**
   * @name RenderLoop#animationFrameObservable
   * @type {Rx.Observable}
   */
  this.animationFrameObservable = animationFrameObservable;

  /**
   * @name RenderLoop#frameId
   * @type {number}
   */
  this.frameId = 0;
}

RenderLoop.prototype.start = function() {
  var self = this;

  self.animationFrameObservable
    .subscribe(function() {
      self.frameId++;
    });
};

module.exports = injector.annotateConstructor(RenderLoop, injector.PROTOTYPE_SCOPE, "animationFrameObservable");
