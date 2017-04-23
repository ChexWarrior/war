var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

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