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
  globStream = require("glob-stream"),
  mapStream = require("map-stream"),
  xargs = require("xargs"),
  gulpWatch = require("gulp-watch"),
  webpack = require("webpack-stream"),
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
    .pipe(webpack(webpackConfig(true)))
    .pipe(gulp.dest("dist/"));
});

gulp.task("watch-unit", function(done) {
  var karma = require("karma"),
    karmaServer = new karma.Server({
      configFile: __dirname + "/etc/karma.unit.conf.js",
      singleRun: false,
      autoWatch: true,
      browsers: [ 'Firefox' ]
    }, done);

  karmaServer.start();
});

gulp.task("dev", [ "watch-ink", "watch-webpack", "watch-unit" ]);

gulp.task("unit", function(done) {
  var karma = require("karma"),
    karmaServer = new karma.Server({
      configFile: __dirname + "/etc/karma.unit.conf.js",
      singleRun: true,
      autoWatch: false,
      browsers: [ "Firefox" ]
    }, function(err) {
      if(err !== 0){
        this.emit("error", new PluginError("karma", {
          message: "Karma Tests failed"
        }));
      }

      done();
    });

  karmaServer.start();
});

function webpackConfig(watch) {
  return {
    watch: watch,
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
