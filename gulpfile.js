'use strict';

var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin'),
    mergeStream = require('merge-stream');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
        // styles
        gulp.task('styles', function () {
        return gulp.src('./css/*.css')
                .pipe(autoprefixer('last 2 version'))
                .pipe(gulp.dest('./dist/css'))
                .pipe(notify({ message: 'Styles task complete' }));
        });

        // copy
        gulp.task('copy', function () {
            return mergeStream(
            gulp.src('./img/icons/*.png')
            .pipe(gulp.dest('dist/img')),
            gulp.src('./*.{txt,json,md,js}*')
            .pipe(gulp.dest('./dist'))
            .pipe(notify({ message: 'Copy task complete' })));
          });
       
            
        // Images
        gulp.task('imagemin', function() {
            return gulp.src('img/**/*.{png,jpg,gif}')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('./dist/img'))
            .pipe(notify({ message: 'Imagemin task complete' }));
        });
        // styles watch
        gulp.task('Styles:Watch', function () {
            gulp.watch('./css/*.css', ['css']);
        });

        // javascript files
        gulp.task('js', function(){
            gulp.src('./js/**/*.js')
            .pipe(gulp.dest('./dist/js'))
            .pipe(notify({ message: 'Javascript task complete' }));
         });
         
        
        // browser-sync
        gulp.task('browser-sync', function () {
            var files = [
            './*.html',
            './css/*.css',
            './img/*.{png,jpg,gif}',
            './js/*.js'
            ];
        
            browserSync.init(files, {
            server: {
                baseDir: "./"
            }
            });
        
        });
        
        // Default task
        gulp.task('default', ['browser-sync'], function() {
            gulp.start('Styles:Watch');
        });

        // clean
        gulp.task('clean', function() {
            return del(['dist']);
        });
        

        gulp.task('usemin', function() {
            return gulp.src('./*.html')
            .pipe(flatmap(function(stream, file){
                return stream
                  .pipe(usemin({
                      css: [ rev() ],
                      html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
                      js: [ uglify(), rev() ],
                      inlinejs: [ uglify() ],
                      inlinecss: [ cleanCss(), 'concat' ]
                  }))
              }))
              .pipe(gulp.dest('dist/'));
          });
          
          gulp.task('build',['clean'], function() {
              gulp.start('copy','imagemin','js','usemin');
          });