"use strict";

import AnimatedSpriteAssetLoader from "./animatedSpriteAssetLoader";
import AnimatedSpriteAsset from "./animatedSpriteAsset";

describe("AnimatedSpriteAssetLoader", function() {
  var animatedSpriteAssetLoader,
    mockPIXI;

  beforeEach(function() {
    mockPIXI = {
      loader: {
        add: sinon.fake()
      }
    };
    animatedSpriteAssetLoader = new AnimatedSpriteAssetLoader(mockPIXI);
  });

  it("will load the base texture using PIXI.js", function() {
    // given asset to load
    var bitmapName = "myBitmap";
    var animatedSpriteAsset = new AnimatedSpriteAsset(bitmapName);

    var fakeBitmap = "0101010bitmap010101",
      fakeGetSpritePng = sinon.fake.returns(fakeBitmap);

    sinon.replace(animatedSpriteAssetLoader, "getSpritePng", fakeGetSpritePng);

    // when prePixiLoad is called
    animatedSpriteAssetLoader.prePixiLoad(animatedSpriteAsset);

    // then PIXI loader add will have been called
    expect.equals(1, mockPIXI.loader.add.callCount, "add was called");
    expect.deepEquals({
      name: bitmapName,
      url: fakeBitmap
    }, mockPIXI.loader.add.getCall(0).lastArg, "add was called with PIXI bitmap loader params");
  });
});
