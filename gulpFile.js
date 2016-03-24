(function() {

	'use strict';

	var gulp = require('gulp'),
			nodemon = require('gulp-nodemon'),
			watch = require('gulp-watch'),
			jshint = require('gulp-jshint'),
			livereload = require('gulp-livereload'),
			_paths = ['server/**/*.js', 'client/js/*.js'];
	
	var browserSync = require('browser-sync');
	var reload = browserSync.reload;
	var watchify = require('watchify');
	var browserify = require('browserify');


	// register nodemon task
	// gulp.task('nodemon', function() {

	// 	nodemon({ script: 'server/server.js'
 //          , ext: 'html js'
 //          });

	// 	browserSync({
	// 		proxy: 'localhost:9090',
	// 		ghostMode: false,
	// 		open: false
	// 	});

	// 	nodemon.on('start', function () {
	// 		reload();
	// 	});

	// 	// nodemon({
	// 	// 	script: 'server/server.js',
	// 	// 	env: {
	// 	// 		'NODE_ENV': 'development'
	// 	// 	}
	// 	// })
	// 	// .on('restart');

	// 	// browserSync({
	// 	// 	proxy: 'localhost:9090',
	// 	// 	ghostMode: false,
	// 	// 	open: false
	// 	// });
	// 	// gulp.watch('client/js/*.js').on('change', reload);
	// });





	// gulp.task( 'dev', function(){
	// 	browserSync({
	// 		proxy: 'localhost:9090',
	// 		ghostMode: false,
	// 		open: false
	// 	});

	// 	// gulp.watch([app + 'assets/scss/{,**/}*.{scss,sass}'], ['sass']);
	// 	// gulp.watch(app + '/**/*.php').on('change', reload);
	// 	// gulp.watch(app + '/**/*.inc').on('change', reload);
	// 	// gulp.watch('client/js/*.js').on('change', ['reload']);
	// 	gulp.watch('client/partials/*.html', ['reload']);
	// });


	// gulp.task('reload', function(){
	// 	console.log('reloaded');
	// });


	// // Rerun the task when a file changes
	// gulp.task('watch', function() {
	// 	// livereload.listen();
	// 	// gulp.src(_paths, {
	// 	// 	read: false
	// 	// })
	// 	// 	.pipe(watch({
	// 	// 		emit: 'all'
	// 	// 	}))
	// 	// 	.pipe(jshint())
	// 	// 	.pipe(jshint.reporter('default'))
	// 	// 	.pipe(livereload());
	// 	// watch(_paths, livereload.changed);

	// 	browserSync({
	// 			proxy: "http://localhost:3000",
	// 			ghostMode: false,
	// 			open: false
	// 	});

	// 	gulp.watch(_paths).on('change', reload);
	// });


	// // Lint js files
	// gulp.task('lint', function(){
	// 	gulp.src(_paths)
	// 		.pipe(jshint())
	// 		.pipe(jshint.reporter('default'));
	// });


	// the default task
	// gulp.task('default', ['lint', 'nodemon', 'watch']);

	// gulp.task('default', ['nodemon']);




	gulp.task('default', ['browser-sync'], function () {
	});

	gulp.task('browser-sync', ['nodemon'], function() {
		browserSync.init(null, {
			proxy: "http://localhost:9090",
      files: ["client/**/*.*"],
      port: 3000,
		});
	});

	
	gulp.task('nodemon', function (cb) {
		
		var started = false;
		
		return nodemon({
			script: 'server/server.js'
		}).on('start', function () {
			// to avoid nodemon being started multiple times
			// thanks @matthisk
			if (!started) {
				cb();
				started = true; 
			} 
		});
	});


}());