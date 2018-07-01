const gulp   = require("gulp"),
      sass   = require("gulp-sass"),
      pre    = require("gulp-autoprefixer"),
      mq     = require("gulp-group-css-media-queries"),
      clean  = require("gulp-clean-css"),
      babel  = require("gulp-babel"),
      concat = require("gulp-concat");

gulp.task("sass", function() {
  gulp.src("src/stylesheets/gumball.scss")
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(mq())
    .pipe(pre({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest("dist/stylesheets"));
});

gulp.task("watch:sass", function() {
  gulp.watch("src/stylesheets/**/*.scss", ["sass"]);
});

gulp.task("js", function() {
  gulp.src(["src/javascripts/polyfills/*.js", "src/javascripts/*.js"])
    .pipe(concat("gumball.js"))
    .pipe(babel({presets: ["env"]}))
    .pipe(gulp.dest("dist/javascripts/"));
});

gulp.task("watch:js", function() {
  gulp.watch(["src/javascripts/polyfills/*.js", "src/javascripts/*.js"], ["js"]);
});

gulp.task("default", ["sass", "js"]);
