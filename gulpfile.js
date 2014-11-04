var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

//$gulp styles
gulp.task('styles', function() {
    return gulp.src(['src/styles/main.scss', 'src/styles/grid.scss', 'src/styles/normalize.scss'])
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5'), 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'styles task complete ...'}))
});

//$gulp scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'scripts task complete ...'}))
});

//$gulp images
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'images task complete ...'}))
});

//$gulp clean
gulp.task('clean', function() {
    return gulp.src(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], {read: false})
        .pipe(clean());
});

//$gulp default
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

//$gulp watch
gulp.task('watch', function() {
    gulp.watch('src/styles/*.scss', ['styles']);

    gulp.watch('src/scripts/*.js', ['scripts']);

    gulp.watch('src/images/*', ['images']);

    var server = livereload();

    gulp.watch(['dist/**']).on('change', function(file) {
        server.changed(file.path);
    });
});




