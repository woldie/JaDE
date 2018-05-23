var fs = require("fs"),
  path = require("path"),
  gulp = require("gulp"),
  globStream = require("glob-stream"),
  mapStream = require("map-stream"),
  xargs = require("xargs"),
  gulpWatch = require("gulp-watch"),
  webpack = require("webpack-stream"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

gulp.task("dev", [ "devInk", "devWebpack" ]);

gulp.task("devInk", function() {
  // call once immediately
  invokeInklecateCompiler();

  // then put it into watcher mode
  return gulpWatch("dialogue/*.ink", function() {
    // call once immediately
    invokeInklecateCompiler();
  });
});

gulp.task("devWebpack", function() {
  return gulp.src("javascript/main.js")
    .pipe(webpack(webpackConfig(true)))
    .pipe(gulp.dest("dist/"));
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
  var inklecateCompiler = process.env.INKLECATE_COMPILER;
  if(!inklecateCompiler) {
    throw new Error("Set the INKLECATE_COMPILER environment variable to the path to an inkjs-compatible inklecate compiler");
  }

  var inklecatePath = path.dirname(inklecateCompiler);
  var inklecateExe = path.basename(inklecateCompiler);

  globStream(["./dialogue/*.ink"], { allowEmpty: false, cwd: '.' })
    .pipe(mapStream(function(inkFile, cb) {
      var srcFilenamePart = path.basename(inkFile.path, ".ink"),
        srcDirPart = path.dirname(inkFile.path),
        absoluteInkFilePath = path.resolve(inkFile.path),
        outputFilePath = path.resolve(srcDirPart, srcFilenamePart + ".json");

      cb(null, [
        "-o",
        outputFilePath,
        absoluteInkFilePath
      ].join(" "));
    }))
    .pipe(xargs(inklecateExe, { cwd: inklecatePath, windowsVerbatimArguments: true }));
}
