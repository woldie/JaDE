/**
 * @license
 * JaDE - A roguelike game engine for HTML.
 * <br />Copyright (C) 2018  Woldrich, Inc.
 *
 * <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *   <img alt="Creative Commons License" style="border-width:0"
 *        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
 *   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *     Creative Commons Attribution-ShareAlike 4.0 International License
 *   </a>.
 */

var fs = require("fs"),
  path = require("path"),
  os = require("os"),
  gulp = require("gulp"),
  shell = require("gulp-shell"),
  each = require("gulp-each"),
  PluginError = require("plugin-error"),
  //globStream = require("glob-stream"),
  //mapStream = require("map-stream"),
  //xargs = require("xargs"),
  gulpWatch = require("gulp-watch"),
  gulpWebpack = require("webpack-stream"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

var isWindows = os.platform() === "win32";

gulp.task("default", function() {
  throw new Error("Make this do a full build someday");
});

gulp.task("watch-ink", function() {
  // call once immediately
  invokeInklecateCompiler();

  // then put it into watcher mode
  return gulpWatch("dialogue/*.ink", function() {
    // call once immediately
    return invokeInklecateCompiler();
  });
});

gulp.task("watch-webpack", function() {
  return gulp.src("javascript/main.js")
    .pipe(gulpWebpack(webpackConfig(true)))
    .pipe(gulp.dest("dist/"));
});

gulp.task("watch-unit", function(done) {
  var karma = require("karma"),
    karmaServer = new karma.Server({
      configFile: __dirname + "/etc/karma.unit.conf.js",
      singleRun: false,
      autoWatch: true,
      browsers: [ "Firefox" ]
    }, done);

  karmaServer.start();
});

gulp.task("jade-harness", function(done) {
  var webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server");

  if(!fs.existsSync("intermediate")) {
    fs.mkdirSync("intermediate");
  }

  // configures webpack to make a jade.js (for running a harness)
  var config = webpackConfig(true);
  config.output.path = path.resolve("./intermediate");

  var jadeScriptServer = new WebpackDevServer(
    webpack(config),
    {
      // webpack-dev-server option
      // or: contentBase: "http://localhost/",
      contentBase: "./intermediate",

      // Enable special support for Hot Module Replacement
      // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
      // Use "webpack/hot/dev-server" as additional module in your entry point
      // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.
      hot: true,

      // webpack-dev-middleware options
      quiet: false,
      noInfo: false,
      lazy: false,
      watchOptions: {
        aggregateTimeout: 100
      },
      publicPath: "/",
      stats: { colors: true },

      // Set this as true if you want to access dev server from arbitrary url.
      // This is handy if you are using a html5 router.
      historyApiFallback: false,

      // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
      // Use "*" to proxy all paths to the specified server.
      // This is useful if you want to get rid of 'http://localhost:8082/' in script[src],
      // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
      proxy: {
      }
    }
  );

  var jadeServerPromise = new Promise(function(resolve) {
    jadeScriptServer.listen(8888, resolve);
  });

  jadeServerPromise.then(function() {
    done();
  });
});

gulp.task("dev", [ "watch-ink", "watch-webpack", "jade-harness", "watch-unit" ]);

gulp.task("unit", function(done) {
  var karma = require("karma"),
    karmaServer = new karma.Server({
      configFile: __dirname + "/etc/karma.unit.conf.js",
      singleRun: true,
      autoWatch: false,
      browsers: [ "FirefoxHeadless" ]
    }, function(err) {
      if(err) {
        console.log("Karma exited with error code: " + err);
      }

      process.exit(err);
    });

  karmaServer.start();
});

function webpackConfig(watch) {
  var entryObj = {};

  entryObj["game"] = path.resolve(__dirname, "./javascript/main.js");

  return {
    watch: watch,
    entry: entryObj,
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        { test: /\.hbs$/, loader: "handlebars-loader" }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin()
    ],
    output: {
      libraryTarget: "this",
      filename: "JaDE.js"
    }
  };
}

function invokeInklecateCompiler() {
  if(!process.env.INKLECATE_COMPILER) {
    throw new Error("Set the INKLECATE_COMPILER environment variable to the path to an inkjs-compatible inklecate compiler");
  }

  return gulp.src("./dialogue/*.ink", {read: false}) // globStream(["./dialogue/*.ink"], { allowEmpty: false, cwd: '.' })
    .pipe(shell(
      'bash ./call_inklecate_compiler.sh -o ' +
        '<% print(path.resolve(path.dirname(file.path), path.basename(file.path, ".ink") + ".json").replace(/\\\\/g, "/")) %> ' +
        '<% print(path.resolve(path.resolve(file.path)).replace(/\\\\/g, "/")) %>',
      { templateData: { "path": path } }));
}
