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
    mergeStream = require('merge-stream'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');
var  rename = require('gulp-rename');
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
                gulp.src('./*.{txt,json,md,js}')
                    .pipe(gulp.dest('./dist'))
                        .pipe(notify({ message: 'Copy task complete' })));
          });

        // html task
        gulp.task('html', function() {
            return gulp.src('./*.html')
                    .pipe(gulp.dest('./dist'))
                    .pipe(notify({ message: 'html task complete' }));
          });
       
            
        // Images
        gulp.task('imagemin', function() {
            return gulp.src('img/**/*.{png,jpg,gif}')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('./dist/img'))
            .pipe(notify({ message: 'Imagemin task complete' }));
        });
        

        // javascript files
        gulp.task('js', function(){
            return gulp.src('./js/**/*.js')
                    .pipe(gulp.dest('./dist/js'))
                    .pipe(notify({ message: 'Javascript task complete' }));
         });

        gulp.task('scripts', function() {
           return gulp.src('./js/**/*.js')
                        .pipe(concat('all.js'))
                        .pipe(gulp.dest('dist/js'))
                        .pipe(notify({ message: 'Scripts task complete' }));
        });
        // minify js files 
        gulp.task('minify', function() {
            return gulp.src('js/**/*.js')
                    .pipe(uglify())
                    .pipe(gulp.dest('dist/js'))
                    .pipe(notify({ message: 'Minify task complete' }));
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
       

        // clean
        gulp.task('clean', function() {
            return del(['dist']);
        });
        
        //usemin there're some errors on the usemin task
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
          
           
        // Default task
        gulp.task('default', ['browser-sync'], function() {
            gulp.start('watch');
        });

        /*
        gulp.task('default', ['clean'], function() {
            gulp.start('styles', 'js', 'images');
        });

        */

        // build task #usemin
        gulp.task('build',['clean'], function() {
              gulp.start('copy','imagemin','js', 'html','styles');
         });
         // styles watch
        gulp.task('watch', function () {
            //  Watch .css files
            gulp.watch('./css/*.css', ['styles']);

            // Watch js files
            gulp.watch('./js/*.js', ['js']);

            // Watch img files
            gulp.watch('./img/*.jpg', ['js']);

            // Watch html files
             // Watch img files
             gulp.watch('./*.html', ['html']);
        });
