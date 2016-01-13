/*
 * Includes
 * @gulp   : gulp necessary lib for usage gulp
 * @sass   : conver scss files to css lib
 * @jshint : check js codes
 * @uglify : minifiy js codes
 * @changes : check diff between dev files and exist output files
 * @cmdColor : write colorfull outputs on console
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var changes = require('gulp-changed');
var cmdColor = require('chalk');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var jsHint = require('jshint-stylish');

/*
 * Variables
 * @dir  : project folder's and file's paths
 * @debug : true || false value for show logs
 */

//  dir
devDir = '.';
devSassDir = devDir + '/resources/scss/';
devSassFiles = devSassDir + '**/*.scss';
devCssDir = devDir + '/resources/css/';
devCssFiles = devCssDir + '**/*.css';
devJsDir = devDir + '/resources/js/';
devJsFiles = devJsDir + '**/*.js';
devViewDir = devDir + '/resources/view/';
devViewFiles = devViewDir + '**/*.html';
devLangDir = devDir + '/_locales/';
devLangFiles = devLangDir + '**/*.json';
devImageDir = devDir + '/resources/img/';
devImageFiles = devImageDir + '**/*';
manifestFile = devDir + '/manifest.json';

productDir = '.././product';
productCssDir = productDir + '/resources/css/';
productCssFiles = productCssDir + '**/*.css';
productJsDir = productDir + '/resources/js/';
productJsFiles = productJsDir + '**/*.js';
productViewDir = productDir + '/resources/view/';
productViewFiles = productViewDir + '**/*.html';
productLangDir = productDir + '/_locales/';
productLangFiles = productLangDir + '**/*.json';
productImageDir = productDir + '/resources/img/';
productImageFiles = productImageDir + '**/*';

bowerDir = './bower_components/'
jqueryLib = bowerDir + 'jquery/dist/jquery.min.js';
dynatableJsLib = bowerDir + 'dynatable/jquery.dynatable.js';
dynatableCssLib = bowerDir + 'dynatable/jquery.dynatable.css';

var debug = true;

/*
 * Helpers
 */

/*
 * log : write messages to console
 * @message : what do you want write to console
 * @type : message type for write style {'info','log','warn','error'}
 */
var log = function(message, type) {
  var error = cmdColor.bold.white.bgRed;
  var warn = cmdColor.bold.white.bgYellow;
  var info = cmdColor.bold.white.bgCyan;
  var log = cmdColor.bold.white.bgGreen;

  if (debug)
    switch (type) {
      case 'info':
        console.info(' Info  :' + info('  ' + message + '  '));
        break;
      case 'log':
        console.log(' Log   :' + log('  ' + message + '  '));
        break;
      case 'warn':
        console.warn(' Warn  :' + warn('  ' + message + '  '));
        break;
      case 'error':
        console.error(' Error :' + error('  ' + message + '  '));
        break;
      default:
        console.log(' Log   :' + log('  ' + message + '  '));
    }
};

log('Info Test...', 'info');
log('Error Test...', 'error');
log('Warn Test...', 'warn');
log('Log Test...', 'log');

var jsHintStyle = {
  "node": true,
  "esnext": true,
  "bitwise": true,
  "curly": true,
  "immed": true,
  "newcap": true,
  "noarg": true,
  "undef": true,
  "unused": "vars",
  "strict": true
};
/*
 * jshint : check js errors with jshint
 * Base dir : ~/dev/resources/js/*.js
 * Output dir : ~/product/resources/js/
 */
gulp.task('jshint', function() {
  log('jshint task is started...', 'info');
  gulp.src(devJsFiles)
    .pipe(changes(productJsFiles))
    .pipe(jshint(jsHintStyle, {
      fail: true
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success
        return false;
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "Line " + data.error.line + ' col ' + data.error.character + ' : ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }))
    .pipe(gulp.dest(productJsDir));
  log('jshint task is done !', 'info');
});

/*
 * sass2css : Covert Sass files to css
 * Base dir : ~/dev/scss/*.scss
 * Output dir : ~/product/css/*.css
 */
gulp.task('sass2css', function() {
  log('sass2css task is started...', 'info');
  gulp.src(devSassFiles)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass().on('error', sass.logError))
    //.pipe(changes(productCssFiles)) #ToDo:Test('Is it block the pipeline')
    .pipe(gulp.dest(productCssDir));
  log('sass2css task is done !', 'info');
});


/*
 * copyViews : copy view files to /product/resources/views
 * Base dir : ~/dev/resources/view/*.html
 * Output dir : ~/product/resources/view/
 */
gulp.task('updateViews', function() {
  log('View files copying...', 'info');
  gulp.src(devViewFiles)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productJsFiles))
    .pipe(gulp.dest(productViewDir));
  log('View copy task is done !', 'info');
});


/*
 * buildExtension : copy static files to the ~/product/ dir if files have any change
 */
gulp.task('buildExtension', function() {
  log('Static files copying...', 'info');

  gulp.src([
      devLangFiles
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productLangFiles))
    .pipe(gulp.dest(productLangDir));
  log('Language task is done !', 'info');

  gulp.src([
      devImageFiles
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productImageFiles))
    .pipe(gulp.dest(productImageDir));
  log('Image task is done !', 'info');

  gulp.src([manifestFile])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productDir))
    .pipe(gulp.dest(productDir));
  log('Manifest file task is done !', 'info');

  gulp.src([jqueryLib])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productJsDir))
    .pipe(gulp.dest(productJsDir));
  log('jqueryLib file task is done !', 'info');

  gulp.src([dynatableJsLib])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productJsDir))
    .pipe(gulp.dest(productJsDir));
  log('dynatableJsLib file task is done !', 'info');

  gulp.src([dynatableCssLib])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productCssDir))
    .pipe(gulp.dest(productCssDir));
  log('dynatableCssLib file task is done !', 'info');

  log('Static task is done !', 'info');
});

/*
 * copyViews : copy manifest file when it's change
 * Base dir : ~/dev/manifest.json
 * Output dir : ~/product/manifest.json
 */
gulp.task('updateManifest', function() {
  log('manifest files copying...', 'info');
  gulp.src(manifestFile)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(changes(productDir))
    .pipe(gulp.dest(productDir));
  log('manifest copy task is done !', 'info');
});

/*
 * Watch : watch file changes and apply predefined funcs.
 */
gulp.task('watch', function() {
  gulp.watch(devJsFiles, ['jshint']);
  gulp.watch(devSassFiles, ['sass2css']);
  gulp.watch(devViewFiles, ['updateViews']);
  gulp.watch(manifestFile, ['updateManifest']);
});


/*
 * Default Gulp Task : Run tasks with when call the "gulp"
 */
gulp.task('default', ['buildExtension', 'sass2css', 'jshint', 'updateViews', 'watch']);
