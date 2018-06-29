var injector = require("jsuice"),
  filter = require("rxjs/operators").filter;

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
    .subscribe(function(frameTime) {
      self.frameId++;
//      console.log("current frame: " + self.frameId + ", time: " + frameTime);
    });
};

module.exports = injector.annotateConstructor(RenderLoop, injector.PROTOTYPE_SCOPE, "animationFrameObservable");
