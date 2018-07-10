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
    fakeTiledWorld;

  beforeEach(function() {
    fakeTiledWorld = { "tiled": "world" };
    tiledUtils = {
      makeTiledWorld: sinon.fake.returns(fakeTiledWorld)
    };
    mockPIXI = {};
    mapAssetLoader = new MapAssetLoader(mockPIXI, tiledUtils);
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
      fakeGetImage = sinon.fake.returns(expectedUrl);
    sinon.replace(MapAssetLoader.prototype, "getTilesetPng", fakeGetImage);

    // and a fake map JSON
    var mapJson = { "imafake": true },
      fakeGetMap = sinon.fake.returns(mapJson);
    sinon.replace(MapAssetLoader.prototype, "getMapJson", fakeGetMap);

    // and a mock PIXI loader is configured
    var fakeLoadedResources = {};
    var fakeTilesetTexture = { "png": "image url blah blah" };
    fakeLoadedResources[tileSetNameToLoad] = fakeTilesetTexture;

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
        expect.equals(fakeTiledWorld, mapAsset.areaMap, "the tiled world returned from tiledUtils#makeTiledWorld");
      }
    );
  });

  // TODO: handle MapAssetLoader and tilemap loading error cases?
});
