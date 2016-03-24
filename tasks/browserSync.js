/*

BrowserSync.js
Url: https://www.npmjs.com/package/browser-sync
Cmd: `npm run watch`

Watches all 'client' files


*/


// Dependencies
// ----------------------------
var BrowserSync = require('browser-sync');
var sass = require('node-sass');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var chalk = require('chalk');

require('es6-promise').polyfill();
var autoprefixer = require('autoprefixer');
var postcss = require('postcss');




// Start BrowserSync
// --------------------------
BrowserSync({
	files: [
		'client/css/*.css',
		'client/js/bundle.js',
		'client/partials/*.html'
	],
	proxy: 'localhost:8080',
	ghostMode: false,
	open: false,
	port: 9090,
	reloadDelay: 500
});



// Directories to watch
// --------------------------
fs.watch('client/sass', compileSASS);
fs.watch('client/js/', compileJS);
fs.watch('client/js/controllers/', compileJS);
fs.watch('client/js/directives/', compileJS);
fs.watch('client/js/services/', compileJS);



// Compile CommonJS
// -------------------------
function compileJS(event, filename){
	if(filename != 'bundle.js'){
		console.log('[' + chalk.blue('SS') + '] ' + chalk.cyan('Watch: ') + chalk.magenta(filename) + ' saved');

		// Execute commands
		exec('browserify client/js/app.js -o client/js/bundle.js --debug', function(err, stdout, stderr) {
			if(err) console.error(err);
			console.log('[' + chalk.blue('SS') + '] ' + chalk.cyan('Watch: ') + chalk.magenta('bundle.js') + ' successfully created');
		});

	}
}




// Compile Sass
// --------------------------

function compileSASS(event, filename) {
	sass.render({
		file: 'client/sass/styles.scss',
		outFile: 'assets/css/styles.css',
		sourceMap: true,
		sourceMapEmbed: true,
		outputStyle: 'compressed',

		success: function(result) {
			console.log('[' + chalk.blue('SS') + '] ' + chalk.cyan('Watch: ') + 'Sass -> CSS Compiling Successful');

			postcss([ autoprefixer ]).process(result.css).then(function(result) {
				result.warnings().forEach(function(warn) {
					console.warn(warn.toString());
				});

				// Write the results to the CSS file
				fs.writeFile('client/css/styles.css', result.css, function(err){
					if(err) console.error('[' + chalk.blue('SS') + '] ' + chalk.cyan('Watch: ') + 'There was an error writing to styles.css', err);
					return console.log('[' + chalk.blue('SS') + '] ' + chalk.cyan('Watch: ') + chalk.magenta(' styles.css') + ' saved successfully');
				});
			});
		},

		error: function(error){
			console.log(error);
		}
	});
}












