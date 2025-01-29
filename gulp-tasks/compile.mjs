import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

async function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

export const sassTask = function() {
  return gulp.src('./src/{global,layout,components}/**/*.scss')
    .pipe(
      sass({ style: 'nested' })
        .on('error', handleError)
    )
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(gulp.dest('./dist/css'))
};

export const jsTask = function() {
  return gulp.src('./src/{global,layout,components}/**/*.es6.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel()
        .on('error', handleError)
    )
    .pipe(rename(function (path) {
      path.dirname = '';
      path.basename = path.basename.replace(/\.es6/, '');
      return path;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
};
