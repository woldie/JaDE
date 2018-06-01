// jscs: disable

if(typeof window !== "undefined") {
  // require("../node_modules/es5-shim/es5-shim.js");
  // require("../node_modules/es5-shim/es5-sham.js");

  // This gets replaced by karma webpack with the updated files on rebuild
  var __karmaWebpackManifest__ = [];

  // keep track if this is the first run of karma in this browser session, lets us trigger a full test run on refresh
  if (typeof window.top.firstRun === "undefined") {
    window.top.firstRun = true;
  }

  // require all modules ending in ".spec" or ".comp" from the
  // current directory and all subdirectories
  var testsContext = require.context("../src/main/javascript", true, /(\.spec)$/);

  function inManifest(path) {
    return __karmaWebpackManifest__.indexOf(path) >= 0;
  }

  var runnable = testsContext.keys().filter(inManifest);

  // Run all tests if this was the first run
  if (window.top.firstRun) {
    runnable = testsContext.keys();
  }

  // console.log(runnable);

  // signals to testingMain.js that the root hooks should be invoked
  window.top.runTestingMain = runnable.length > 0;

  runnable.forEach(testsContext);

  window.top.firstRun = false;
}
