var gulp = require("gulp"),
  webpack = require("webpack-stream"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

gulp.task("dev", function() {
  return gulp.src("javascript/main.js")
    .pipe(webpack(webpackConfig(true)))
    .pipe(gulp.dest("dist/"));
});

function webpackConfig(watch) {
  return {
    watch: watch,
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css" }
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