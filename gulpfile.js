var fs = require("fs"),
  child_process = require("child_process"),
  path = require("path"),
  gulp = require("gulp"),
  chug = require("gulp-chug");

gulp.task("dev", function() {
  gulp.src("./packages/game/gulpfile.js")
    .pipe(chug({
      tasks:  [ "dev" ]
    }));
});
