var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

gulp.task('style', () => {
  return gulp.src('app/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/styles/'));
});

gulp.task('script', () => {
  return gulp.src('app/scripts/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/scripts/compiled'));
});

gulp.task('build', ['style','script']);