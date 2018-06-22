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
        // styles
        gulp.task('styles', function () {
        return gulp.src('./css/*.css')
                .pipe(autoprefixer('last 2 version'))
                .pipe(gulp.dest('./dist/css'));
        });

        // copy
        gulp.task('copy', function () {
            return mergeStream(
            gulp.src('./imgs/**/*')
            .pipe(gulp.dest('dist/img')),
            gulp.src('./img/icon/*')
            .pipe(gulp.dest('/dist/img/icon')),
            gulp.src('./*.{txt,json,md}')
            .pipe(gulp.dest('./dist'))
            );
          });
       
            
        // Images
        gulp.task('imagemin', function() {
            return gulp.src('img/*.{png,jpg,gif}')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('dist/img'));
        });
        // styles watch
        gulp.task('Styles:watch', function () {
        gulp.watch('./css/*.css', ['css']);
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
            gulp.start('styles:watch');
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
              gulp.start('copy','imagemin','usemin');
          });