var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var imagemin = require('gulp-imagemin');
var cssminify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();


// Static Server + watching scss/html files
gulp.task('serve', ['scss', 'js'], function() {

  browserSync.init({
    server: "./build"
  });

  gulp.watch("src/styles/*.scss", ['sass']);
  gulp.watch("src/scripts/*.js", ['js-watch']);
  gulp.watch("src/*.html", ['html-watch']);
});


gulp.task('clean', function() {
  return del(['build']);
});


gulp.task('scss', function() {
  return gulp.src("src/styles/*.scss")
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(concat('styles.min.css'))
      .pipe(cssminify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/css"))
    .pipe(notify({
      message: '[Task] `sass` complete'
    }))
    .pipe(browserSync.stream());
});


gulp.task('js', function() {
  var task = browserify({
      entries: [
        'src/scripts/main.js'
      ]
    })
    .transform(babelify);
  return task.bundle()
    .pipe(source('scripts.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
      .pipe(eslint())
      // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'))
    .pipe(notify({
      message: '[Task] `js` complete'
    }));
});


gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
    .pipe(notify({
      message: '[Task] `html` complete'
    }));
});


gulp.task('image', function() {
  return gulp.src('src/images/*')
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});


// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);

gulp.task('default', ['serve', 'image', 'html']);
