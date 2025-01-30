// Importing necessary dependencies using ESM
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';

//=======================================================
// Compress svg/png/jpg files.
//=======================================================
export function assets() {
  return gulp.src([
      './src/{global,components}/**/*{.png,.jpg,.svg}'
    ])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(gulp.dest('./dist/assets'));
}
