import gulp from 'gulp';
import sassModule from 'gulp-sass';
import sass from 'sass';  // Import the 'sass' package
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

// Set the Sass compiler explicitly
const sass = sassModule(sass);

// Error handling for gulp tasks
async function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Renamed `sass` to avoid conflicts with the imported `gulp-sass` module
export const compileSass = function(prefix) {
  return gulp.src('./src/{global,layout,components}/**/*.scss')
    .pipe(sass({ style: 'nested' }).on('error', handleError))
    .pipe(prefix())
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(gulp.dest('./dist/css'));
};

export const compileJs = function() {
  return gulp.src('./src/{global,layout,components}/**/*.es6.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(rename(function (path) {
      path.basename = path.basename.replace(/\.es6/, '');
      path.dirname = '';
      return path;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
};
