'use strict';

var path = require('path');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserSync = require('browser-sync').create();
var watchify = require('watchify');

gulp.task('javascript', function() {
  var bundler = watchify(browserify('lib/assets/js/index.js', { debug: true }))
    .transform(babelify);
  bundler.on('update', rebundle);
  function rebundle() {
    return bundler.bundle()
      .pipe(source('bundle.js'))
      .on('error', function (err) { console.log('Error : ' + err.message); })
      .pipe(gulp.dest('public/assets/js'));
  }
  return rebundle();
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });
});

gulp.watch([path.join(__dirname, 'public/*.html'), path.join(__dirname, 'public/assets/js/bundle.js')])
    .on('change', browserSync.reload);

gulp.task('default', ['javascript', 'browser-sync']);