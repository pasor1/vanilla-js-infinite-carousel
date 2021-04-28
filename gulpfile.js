const gulp = require('gulp');
const sassCompile = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terserJS = require('gulp-terser');
const babelJS = require('gulp-babel');
const webserver = require('gulp-webserver');

const distFolder = 'dist';
const jsDistFolder = 'dist/js';
const cssDistFolder = 'dist/css';

//move HTML files to dist folder
function moveHtml() {
  return gulp
    .src(['src/*.html'])
    .pipe(gulp.dest(distFolder))
}

// SCSS transpile & minify
function parseScss() {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sassCompile().on('error', sassCompile.logError))
    .pipe(cleanCSS({ debug: true }, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(cssDistFolder))
}

// JS minify
function parseJS() {
  return gulp
    .src(['src/js/*.js'])
    .pipe(babelJS())
    .pipe(terserJS())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(jsDistFolder))
}

// dev webserver
function serve() {
  return gulp.src('dist/')
    .pipe(webserver({
      host: 'localhost',
      port: 1234,
      livereload: true,
      open: true,
      fallback: 'dist/index.html'
    }));
}

// watch for modify
function watch() {
  gulp.watch('src/scss/*.scss', parseScss);
  gulp.watch(['src/js/*.js'], parseJS);
  gulp.watch(['src/*.html'], moveHtml);
}

// Run tasks
exports.dev = gulp.series(moveHtml, parseScss, parseJS, serve, watch);
exports.build = gulp.series(moveHtml, parseScss, parseJS);