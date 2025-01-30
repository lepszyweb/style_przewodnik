var gulp = require('gulp');
var sync = require('browser-sync');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

// Dynamically import gulp-autoprefixer (ESM module)
var prefixPromise = import('gulp-autoprefixer');

// Dynamically import tasks from .mjs files
const taskCompilePromise = import('./gulp-tasks/compile.mjs');
const taskCleanPromise = import('./gulp-tasks/clean.mjs');
const taskMove = require('./gulp-tasks/move.js');
const taskLint = require('./gulp-tasks/lint.js');
const taskCompressPromise = import('./gulp-tasks/compress.mjs'); // Using .mjs for compress task
const taskStyleGuide = require('./gulp-tasks/styleguide.js');
const taskConcat = require('./gulp-tasks/concat.js');

// Compile Sass and JS
gulp.task('compile:sass', async function() {
  const taskCompile = await taskCompilePromise;
  const prefix = (await prefixPromise).default;
  return taskCompile.compileSass(prefix);
});

gulp.task('compile:js', async function() {
  const taskCompile = await taskCompilePromise;
  return taskCompile.compileJs();
});

// Move JS and Docs
gulp.task('move:js', function() {
  return taskMove.js();
});

gulp.task('move:docs', function() {
  return taskMove.docs();
});

gulp.task('compile', gulp.series('compile:sass', 'compile:js', 'move:js'));

// Lint Sass and JS
gulp.task('lint:sass', function() {
  return taskLint.sass();
});

gulp.task('lint:js', function() {
  return taskLint.js();
});

gulp.task('lint', gulp.series('lint:sass', 'lint:js'));

// Compress Files (using dynamically imported .mjs task)
gulp.task('compress', async function() {
  const taskCompress = await taskCompressPromise;
  return taskCompress.assets();
});

// Generate style guide
gulp.task('styleguide', function() {
  return taskStyleGuide.generate(__dirname);
});

// Concat all CSS files into a master bundle
gulp.task('concat', function() {
  return taskConcat.css();
});

// Clean directories
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

// Watch and recompile sass
gulp.task('watch:sass', gulp.series('lint:sass', 'compile:sass', 'concat'));

// Main watch task
gulp.task('watch', function() {
  gulp.watch('./src/{global,layout,components}/**/*.scss', gulp.series('watch:sass'));
  gulp.watch('./src/{global,layout,components}/**/*.js', gulp.series('lint:js', 'compile:js'));
  gulp.watch('./src/{layout,components}/**/*.twig', gulp.series('watch:styleguide'));
});

// Reload the browser if the style guide is updated
gulp.task('watch:styleguide', gulp.series('styleguide', sync.reload));

// Default Task
gulp.task('default', gulp.series('clean', gulp.parallel('compile', 'compress', 'styleguide'), 'concat'));
