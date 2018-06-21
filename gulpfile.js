'use strict';

var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync');

        gulp.task('css', function () {
        return gulp.src('./css/*.css')
                .pipe(gulp.dest('./css'));
            });
            
        gulp.task('images', function() {
        return gulp.src('./images/**/*')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('build/images'))
            .pipe(notify({ message: 'Images task complete' }));
        });
    
        gulp.task('css:watch', function () {
        gulp.watch('./css/*.css', ['css']);
        });
        
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
            gulp.start('css:watch');
        });
        