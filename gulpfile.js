'use strict';

var   gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require('del'),
    useref = require('gulp-useref'),
       rev = require('gulp-rev'),
revReplace = require('gulp-rev-replace'),
       iff = require('gulp-if'),
      csso = require('gulp-csso'),
     pages = require('gulp-gh-pages');

var options = {
  src: './src/',
  dist: './dist/'
}

/** Compile Sass file */
gulp.task('compileSass', function() {
  return gulp.src(options.src + 'scss/main.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.src + 'css/'));
});

/** Compile Saas, uglifiy, minifiy, combine file, cache busting, move to dist */
gulp.task('html', ['compileSass'], function() {
  var assets = useref.assets();
  return gulp.src(options.src + 'index.html')
              .pipe(assets)
              .pipe(iff('*.js', uglify()))
              .pipe(iff('*.css', csso()))
              .pipe(rev())
              .pipe(assets.restore())
              .pipe(useref())
              .pipe(revReplace())
              .pipe(gulp.dest(options.dist));
});

/** Watch scss files for changes and compile it */
gulp.task('watchFiles', function() {
  gulp.watch(options.src + 'scss/**/*.scss', ['compileSass']);
});

/** Copy static asset to dist folder */
gulp.task('assets', function(){
  return gulp.src([options.src + 'img/**/*',
                   options.src + 'fonts/**/*',
                   options.src + 'font-awesome/**/*'], {base: options.src})
          .pipe(gulp.dest(options.dist));
})

/** compile saas, then watch for changes. then compile it again */
gulp.task('serve', ['compileSass', 'watchFiles']);

/** delete dist folder */
gulp.task('clean', function() {
  del([options.dist]);
  // delete compiles css and map
  del([options.src + 'css/main.css*']);
});

/** Build to dist folder */
gulp.task('build', ['html', 'assets'])

/** Deploy to github page */
gulp.task('deploy', function() {
  return gulp.src(options.dist + '**/*')
             .pipe(pages());
})

gulp.task('default', ['clean'], function(){
  gulp.start('build');
});
