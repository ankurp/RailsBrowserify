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

gulp.task('sass', function() {
  return gulp.src('app/assets/stylesheets/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('js', function() {
  var bundler = watchify(browserify({ debug: true }))
    .transform(babelify);
  bundler.on('update', rebundle);
  function rebundle() {
    return bundler.bundle()
      .pipe(source('bundle.js'))
      .on('error', function (err) { console.log('Error : ' + err.message); })
      .pipe(gulp.dest('public/assets/javascripts'));
  }
  return rebundle();
});

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'localhost:3000'
  });
});

gulp.watch([
    path.join(__dirname, 'public/*.html'), 
    path.join(__dirname, 'public/assets/javascripts/bundle.js'),
    path.join(__dirname, 'public/assets/stylesheets/application.css')
  ]).on('change', browserSync.reload);
gulp.watch('app/assets/stylesheets/*.scss', ['sass']);

gulp.task('default', ['js', 'sass', 'browser-sync']);
