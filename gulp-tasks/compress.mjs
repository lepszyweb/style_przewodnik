import gulp from 'gulp';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';

// Compress svg/png/jpg files.
export const assets = () => {
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
};
