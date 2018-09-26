'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        files: ["**/*.*"],
        browser: "google chrome",
        port: 7000,
  });
});
gulp.task('nodemon', function (cb) {
  
  var started = false;
  
  return nodemon({
    script: 'app.js',
    'env': {
      DEBUG: 'crawler:*'
    }
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true; 
      console.log('here');
      browserSync.reload;
    } 
  }).on('restart', function () {
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 1000);
  });
});