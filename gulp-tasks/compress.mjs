/*eslint strict: ["error", "global"]*/
'use strict';

//=======================================================
// Include gulp
//=======================================================
var gulp = require('gulp');

//=======================================================
// Include Our Plugins
//=======================================================
var rename      = require('gulp-rename');
var imagemin    = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminMozjpeg = require('imagemin-mozjpeg');

// Export our tasks.
module.exports = {

  // Compress svg/png/jpg files.
  assets: function() {
    return gulp.src([
      './src/{global,components}/**/*{.png,.jpg,.svg}'
    ])
      .pipe(imagemin([
        // PNG compression
        imageminPngquant({ quality: [0.6, 0.8] }), // Example PNG compression quality
        // JPEG compression
        imageminMozjpeg({ quality: 75, progressive: true }), // Example JPEG compression quality
        // SVG optimization (new API)
        imagemin.svgo({ plugins: [{ removeViewBox: false }] })
      ]))
      .pipe(rename(function (path) {
        path.dirname = ''; // Flatten the folder structure
        return path;
      }))
      .pipe(gulp.dest('./dist/assets'));
  }
};
