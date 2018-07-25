"use strict";

import AssetManager from "./assetManager";
import AssetLoader from "./assets/assetLoader";
import MapAsset from "./assets/mapAsset";
import MapAssetLoader from "./assets/mapAssetLoader";

describe("AssetManager", function() {
  var assetManager,
    tiledUtils,
    mapAssetLoader,
    mockPIXI,
    mockDisplay;

  function FakeContainer() {
    this.children = [];
  }

  beforeEach(function() {
    tiledUtils = {
      makeTiledWorld: sinon.fake()
    };
    mockPIXI = {
      Container: FakeContainer
    };
    mockDisplay = {
      makeCamera: sinon.fake()
    };
    mapAssetLoader = new MapAssetLoader(mockPIXI, tiledUtils, mockDisplay);
    assetManager = new AssetManager(mockPIXI, mapAssetLoader);
  });

  afterEach(function() {
    sinon.restore();
  });

  it("will program the loader to load map and tileset bitmap", function() {
    // for expected map and tileset
    var mapNameToLoad = "myMap";
    var tileSetNameToLoad = "myTileset";

    // given a map asset loader
    var mapAsset = new MapAsset(mapNameToLoad, tileSetNameToLoad);

    // and a fake image URL returned by a fake getTilesetPng function
    var expectedUrl = "PNG BASE64",
      fakeGetImage = sinon.fake.returns(expectedUrl),
      fakeDescriptor = sinon.fake.returns({ "fake": "json" });

    sinon.replace(MapAssetLoader.prototype, "getTilesetPng", fakeGetImage);
    sinon.replace(MapAssetLoader.prototype, "getTilesetDescriptor", fakeDescriptor);

    // and a fake map JSON
    var mapJson = { layers: [
      { type: "tilelayer", name: "Ground"},
      { type: "tilelayer", name: "Roof"}
    ]},
      fakeGetMap = sinon.fake.returns(mapJson);
    sinon.replace(MapAssetLoader.prototype, "getMapJson", fakeGetMap);

    // and a mock PIXI loader is configured
    var fakeLoadedResources = {};
    var fakeTilesetTexture = { "png": "image url blah blah" };
    fakeLoadedResources[tileSetNameToLoad] = fakeTilesetTexture;

    // and a mock Display that returns a camera
    var fakeCamera = { "kaclick": true };
    mockDisplay.makeCamera = sinon.fake.returns(fakeCamera);

    // and a mock makeTiledWorld util that will return a tiled world
    var groundLayer = { name: "Ground" };
    var roofsLayer = { name: "Roof" };
    var mockTiledWorld = {
      children: [
        groundLayer,
        roofsLayer
      ],
      objects: [
        groundLayer,
        roofsLayer
      ],
      addChildAt: sinon.fake(),
      removeChild: sinon.fake()
    };
    tiledUtils.makeTiledWorld = sinon.fake.returns(mockTiledWorld);

    mockPIXI.loader = {};
    mockPIXI.loader.add = sinon.fake();
    // fake will call any callback function passed to it asynchronously, ASAP
    mockPIXI.loader.load = sinon.fake.yieldsAsync(mockPIXI.loader, fakeLoadedResources);

    // when assetManager.loadAll is called with the MapAsset
    return assetManager.loadAll([
      mapAsset
    ]).then(
      function(resultAssets) {
        // then we get back our list of Assets passed to loadAll
        expect.equals(1, resultAssets.length);
        expect.isSameReference(mapAsset, resultAssets[0], "reference is the same");

        // and PIXI#add was called for the tileset texture
        expect.equals(1, mockPIXI.loader.add.callCount, "PIXI loader was interacted with");
        expect.deepEquals({
          name: tileSetNameToLoad,
          url: expectedUrl
        }, mockPIXI.loader.add.getCall(0).lastArg, "fakeGetImage was called prior to load to instruct Pixi to read the tileset PNG");

        // and PIXI#load was called
        expect.equals(1, mockPIXI.loader.load.callCount, "PIXI loader was interacted with");

        // and our MapAssetLoader#postPixiLoad business logic was executed and MapAsset filled out as expected
        expect.equals(1, tiledUtils.makeTiledWorld.callCount, "makeTiledWorld was called");
        expect.equals(fakeTilesetTexture, mapAsset.tileset, "the tileset was pulled from loaded resources");
        expect.equals(mockTiledWorld, mapAsset.areaMap, "the tiled world returned from tiledUtils#makeTiledWorld");

        // and our Roof layer was temporarily deleted
        expect.equals(1, mapAsset.areaMap.removeChild.callCount);
        expect.equals(roofsLayer, mapAsset.areaMap.removeChild.lastArg, "roof was removed");

        // and a Sprites layer was added after Ground
        expect.equals(1, mapAsset.areaMap.addChildAt.callCount);
        var newSpritesLayer = mapAsset.areaMap.addChildAt.getCall(0).args[0];
        expect.equals("Sprites", newSpritesLayer.name, "added sprites layer");
      }
    );
  });

  // TODO: handle MapAssetLoader and tilemap loading error cases?
});
