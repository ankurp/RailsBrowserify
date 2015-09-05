'use strict';

var path = require('path');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserSync = require('browser-sync').create();
var watchify = require('watchify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');

var config = {
  src: 'app/assets',
  dest: 'public/assets'
};

if (process.argv[2] === 'watch') {
  gulp.watching = true;
}

gulp.task('default', ['build']);

gulp.task('build', function(cb) {
  var tasks = [['js', 'sass', 'images', 'lint']];
  if (process.env.RAILS_ENV === 'production') {
    tasks.push('minify', 'rev');
  }
  tasks.push(cb);
  runSequence.apply(null, tasks);
});


gulp.task('sass', function() {
  return gulp.src(path.join(config.src, 'stylesheets/*.{scss,sass}'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/stylesheets'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  var bundler = browserify(path.join(config.src, 'javascripts/index.js'), { debug: true })
    .transform(babelify);

  if (gulp.watching) {
    bundler = watchify(bundler);
  }

  bundler.on('update', rebundle);
  function rebundle() {
    return bundler.bundle()
      .pipe(source('bundle.js'))
      .on('error', function (err) { console.log('Error : ' + err.message); })
      .pipe(gulp.dest('public/assets/javascripts'));
  }
  return rebundle();
});

gulp.task('images', function() {
  return gulp.src(path.join(config.src, 'images/**.*'))
             .pipe(gulp.dest(path.join(config.dest, 'images')));
});

gulp.task('minify', function() {
  var uglify = require('gulp-uglify');
  var bundlePath = path.join(config.dest, 'javascripts/bundle.js');
  return gulp.src(bundlePath)
             .pipe(uglify())
             .pipe(bundlePath);
});

gulp.task('rev', function() {
  var rev = require('gulp-rev');
  return gulp.src([
    path.join(config.dest, 'stylesheets/application.css'), 
    path.join(config.dest, 'javascripts/bundle.js')
  ], {base: 'assets'})
  .pipe(rev())
  .pipe(gulp.dest(config.dest))
  .pipe(rev.manifest())
  .pipe(gulp.dest(config.dest));
});

gulp.task('lint', function() {
  var eslint = require('gulp-eslint');
  var stream = gulp.src(path.join(config.src, 'javascripts/**/*.js'))
                   .pipe(eslint())
                   .pipe(eslint.format());
  if (!gulp.watching) {
    stream = stream.pipe(eslint.failAfterError());
  }
  return stream;
});

gulp.task('watch', ['build'], function(cb) {
  gulp.watch([
    path.join(config.dest, 'javascripts/bundle.js')
  ]).on('change', browserSync.reload);
  gulp.watch(path.join(config.src, 'stylesheets/*.{scss,sass}'), ['sass']);
  gulp.watch(path.join(config.src, 'images/**/*'), ['images']);

  browserSync.init({
    proxy: 'localhost:3000'
  });
});
