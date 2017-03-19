"use strict";

// Import 3rd party packages
const gulp = require('gulp');
const changed = require('gulp-changed');
const gpath = require('gulp-path');
const gutil = require('gulp-util');
const count = require('gulp-count');
const gulpif = require('gulp-if');

// Gulp default settings
const settings = {
    // firstBuild : When gulp started call build function.
    // -Default : true
  firstBuild : true,
    // autoDestToProduct : When a file changed (e.g. : css,js,html,...) build and dest to the product directory.
    // -Default : true
  autoDestToProduct : true
};


// Plugin dir structure and file declarations
const pluginBase = new gpath.Base({
        src: './',
        dest: '../product/'
});

const paths = {
    views       : pluginBase.Path('views','.html'),
    scripts     : pluginBase.Path('scripts','.js'),
    styles      : pluginBase.Path('styles','.css'),
    resources   : pluginBase.Path('resources'),
    images      : pluginBase.Path('resources/images'),
    settings    : pluginBase.Path('resources/settings'),
    thirdParty  : pluginBase.Path('third_party'),
    fonts       : pluginBase.Path('third_party/fonts')
};

// Solution for double dot and double backslash problem of gulp-path package with self called function
(function(){
    for(let path in paths){
        paths[path].src  = '.\\' + paths[path].src.toString().replace('..','.').replace(/\\\\/g, '\\');
        paths[path].dest = paths[path].dest.toString().replace(/\\\\/g, '\\');
    }
})();

/* Build bundle  */
gulp.task('build',["build_scripts","build_styles","build_views","third_party","build_resource"]);

gulp.task('build_scripts', () => {
    let scripts = gulp.src(paths.scripts.src)
	    .pipe(changed(paths.scripts.dest))
        .pipe(gulpif(settings.autoDestToProduct, gulp.dest(paths.scripts.dest) ))
        .pipe(gulpif(settings.autoDestToProduct, count('<%= counter %> scripts build & distributed') ));
    return scripts;
});

/*
* Build_styles : get sass files and compile them to css then dest to product if auto dest is available
*/
gulp.task('build_styles', () => {
	let styles = gulp.src(paths.styles.src)
		.pipe(changed(paths.styles.dest))
		.pipe(gulpif(settings.autoDestToProduct, gulp.dest(paths.styles.dest) ))
		.pipe(gulpif(settings.autoDestToProduct, count('<%= counter %> styles build & distributed') ));
	return styles;
});

/*
 * Build_styles : get sass files and compile them to css then dest to product if auto dest is available
 */
gulp.task('build_views', () => {
	let views = gulp.src(paths.views.src)
		.pipe(changed(paths.views.dest))
		.pipe(gulpif(settings.autoDestToProduct, gulp.dest(paths.views.dest) ))
		.pipe(gulpif(settings.autoDestToProduct, count('<%= counter %> views build & distributed') ));
	return views;
});

/*
 * Build_styles : get sass files and compile them to css then dest to product if auto dest is available
 */
gulp.task('third_party', () => {
	let thirdParty = gulp.src(paths.thirdParty.src)
		.pipe(changed(paths.thirdParty.dest))
		.pipe(gulpif(settings.autoDestToProduct, gulp.dest(paths.thirdParty.dest) ))
		.pipe(gulpif(settings.autoDestToProduct, count('<%= counter %> thirdParty build & distributed') ));

});

/*
 * Build_resource : dest resources files
 */
gulp.task('build_resource', () => {
	let views = gulp.src(paths.views.src)
		.pipe(changed(paths.views.dest))
		.pipe(gulpif(settings.autoDestToProduct, gulp.dest(paths.views.dest) ))
		.pipe(gulpif(settings.autoDestToProduct, count('<%= counter %> views distributed') ));


	let images = gulp.src(paths.images.src)
		.pipe(changed(paths.images.dest))
		.pipe(gulpif(settings.autoDestToProduct, gulp.dest(paths.images.dest) ))
		.pipe(gulpif(settings.autoDestToProduct, count('<%= counter %> images distributed') ));

	let productRoot = pluginBase.Path().dest.toString().replace(/\\\\/g, '\\');
	let manifest = gulp.src(paths.settings.src)
		.pipe(changed(productRoot))
		.pipe(gulpif(settings.autoDestToProduct, gulp.dest(productRoot) ))
		.pipe(gulpif(settings.autoDestToProduct, count('manifest updated') ));
});

// Watch all paths for file changes
gulp.task('track-changes', () => {
    gulp.watch(paths.scripts.src,['build_scripts']);
    gulp.watch(paths.styles.src,['build_styles']);
    gulp.watch(paths.views.src,['build_views']);
    gulp.watch(paths.resources.src,['build_resource']);
    gulp.watch(paths.resources.images,['build_resource']);
    gulp.watch(paths.resources.settings,['build_resource']);
    gulp.watch(paths.thirdParty,['build_resource']);
});

// First Build of new session
gulp.task('first-build', () => {
    if(settings.firstBuild){
        gulp.start('build');
    }
});

// Start gulp first build and assign watchers
gulp.task('default',['first-build','track-changes']);
