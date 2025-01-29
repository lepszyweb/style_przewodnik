'use strict';

//=======================================================
// Include gulp
//=======================================================
var gulp = require('gulp');

//=======================================================
// Include Our Plugins
//=======================================================
var sync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

// Dynamically import gulp-autoprefixer (ESM module)
var prefixPromise = import('gulp-autoprefixer');

//=======================================================
// Include Our tasks (using dynamic import for .mjs files)
//=======================================================
const taskCompilePromise = import('./gulp-tasks/compile.mjs');
const taskCleanPromise = import('./gulp-tasks/clean.mjs');
const taskMove = require('./gulp-tasks/move.js');
const taskLint = require('./gulp-tasks/lint.js');
const taskCompress = require('./gulp-tasks/compress.js');
const taskStyleGuide = require('./gulp-tasks/styleguide.js');
const taskConcat = require('./gulp-tasks/concat.js');

//=======================================================
// Compile Our Sass and JS
//=======================================================

gulp.task('compile:sass', async function() {
  const taskCompile = await taskCompilePromise;
  const prefix = (await prefixPromise).default;
  return taskCompile.sass(prefix);
});

gulp.task('compile:js', async function() {
  const taskCompile = await taskCompilePromise;
  return taskCompile.js();
});

gulp.task('move:js', function() {
  return taskMove.js();
});

gulp.task('move:docs', function() {
  return taskMove.docs();
});

gulp.task('compile', gulp.series('compile:sass', 'compile:js', 'move:js'));

//=======================================================
// Lint Sass and JavaScript
//=======================================================

gulp.task('lint:sass', function() {
  return taskLint.sass();
});

gulp.task('lint:js', function() {
  return taskLint.js();
});

gulp.task('lint', gulp.series('lint:sass', 'lint:js'));

//=======================================================
// Compress Files
//=======================================================
gulp.task('compress', function() {
  return taskCompress.assets();
});

//=======================================================
// Generate style guide
//=======================================================
gulp.task('styleguide', function() {
  return taskStyleGuide.generate(__dirname);
});

//=======================================================
// Concat all CSS files into a master bundle
//=======================================================
gulp.task('concat', function() {
  return taskConcat.css();
});

//=======================================================
// Clean all directories (dynamically load clean tasks)
//=======================================================
gulp.task('clean:styleguide', async function() {
  const taskClean = await taskCleanPromise;
  return taskClean.styleguide();
});

gulp.task('clean:css', async function() {
  const taskClean = await taskCleanPromise;
  return taskClean.css();
});

gulp.task('clean:js', async function() {
  const taskClean = await taskCleanPromise;
  return taskClean.js();
});

gulp.task('clean:docs', async function() {
  const taskClean = await taskCleanPromise;
  return taskClean.docs();
});

gulp.task('clean', gulp.series('clean:css', 'clean:js', 'clean:styleguide', 'clean:docs'));

//=======================================================
// Watch and recompile sass
//=======================================================

gulp.task('watch:sass', gulp.series('lint:sass', 'compile:sass', 'concat'));

// Main watch task
gulp.task('watch', function() {
  gulp.watch('./src/{global,layout,components}/**/*.scss', gulp.series('watch:sass'));
  gulp.watch('./src/{global,layout,components}/**/*.js', gulp.series('lint:js', 'compile:js'));
  gulp.watch('./src/{layout,components}/**/*.twig', gulp.series('watch:styleguide'));
});

// Reload the browser if the style guide is updated.
gulp.task('watch:styleguide', gulp.series('styleguide', sync.reload));

//=======================================================
// Default Task
//=======================================================
gulp.task('default', gulp.series('clean', gulp.parallel('compile', 'compress', 'styleguide'), 'concat'));
