const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

gulp.task('watch', () => {
  gulp.watch('app/styles/*.scss', ['style']);
  gulp.watch('app/scripts/src/*.js', ['script']);
});

gulp.task('style', () => {
  return gulp.src('app/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/styles/'));
});

gulp.task('script', () => {
  return gulp.src('app/scripts/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
      plugins: [ "transform-async-functions"]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/scripts/compiled'));
});

gulp.task('build', ['style','script']);
gulp.task('default', ['build']);